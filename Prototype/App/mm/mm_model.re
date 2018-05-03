type t =
  { balance: list(Money.t)
  , bills: list(Bill.t)
  , categories: list(Spending_category.t)
  , payments: list(Payment.t)
  };

let model =
  ref(
    { balance: [Money.({currency: Currency.Usd, amount: 1000.0})]
    , bills: []
    , categories:
      [ Spending_category.make(~color="#df7a7a", "Rent", Monthly, 250.0)
      , Spending_category.make(~color="#7adf7a", "Gas", Daily, 10.0)
      , Spending_category.make(~color="#74d9da", "Groceries", Weekly, 30.0)
      , Spending_category.make(~color="#7a7adf", "Eating Out", Monthly, 200.0)
      ]
    , payments: []
    });

let stateManagers: ref(list((string, unit => unit))) = ref([]);

let getModel() = model.contents;

let setModel(x) = {
  model.contents = x;
  /*List.iter(((_, x)) => x(), stateManagers.contents);*/
  model.contents
};

let addStateManager(name, func) = {
  let sms = stateManagers.contents;
  if (List.exists(((name', _)) => name' == name, stateManagers.contents)) {
    ()
  } else {
    stateManagers.contents = [(name, func), ...sms]
  }
};

let removeStateManager(name) = {
  stateManagers.contents = List.filter(((name', _)) => name' != name, stateManagers.contents)
};

let getCategoryColor(cat) = {
  try {
    let cat = List.find((x) => x##name == cat, getModel().categories);
    cat##color
  } {
    | Not_found => "#000000"
  }
};

let addBill(owedTo, schedule, amount, startingOn, category) = {
  let schedule =
    switch schedule {
    | Bill.Weekly(day) =>
        Bill.Fixed(7)
    | _ => schedule
    };
  let bill =
    Bill.{
      firstDue: startingOn
    , schedule: schedule
    , owedTo: owedTo
    , method: `Cash
    , amount: `Fixed(amount)
    , description: ""
    , category: category
    };
  Js.log2("New Bill: ", bill);
  setModel({...getModel(), bills: [bill, ...getModel().bills]});
};

let finalizePayment(x: Payment.t) = {
  open Payment;
  let model' = {...model.contents, payments: [x, ...model.contents.payments]};
  setModel(model');
  Js.log2("Model: ", getModel());
};

addBill(
  "Arthur",
  Bill.MonthlyInterval(25),
  Money.{currency: Currency.Usd, amount: 250.0},
  Date.make(2018, 2, 25),
  "Rent");
addBill(
  "CenturyLink",
  Bill.MonthlyInterval(22),
  Money.{currency: Currency.Usd, amount: 15.0},
  Date.make(2018, 2, 22),
  "Rent");
addBill(
  "Xinyu",
  Bill.MonthlyInterval(29),
  Money.{currency: Currency.Usd, amount: 50.0},
  Date.make(2018, 2, 29),
  "Eating Out");
addBill(
  "John Brook's",
  Bill.Fixed(7),
  Money.{currency: Currency.Usd, amount: 40.0},
  Date.make(2018, 2, 22),
  "Groceries");

let getCategoriesArray() = Array.of_list(getModel().categories);

let getCategoryByName(name) =
  List.find((cat) => cat##name == name, getModel().categories);

let addCategory(nam) = {
  Js.log2("Adding category named ", nam);
  let cats = getModel().categories;
  let color =
    List.find((c) => !List.exists((cat) => cat##color == c, cats),
      Spending_category.colors);
  let model' = {...getModel(), categories: [Spending_category.make(~color, nam, Monthly, 100.0), ...getModel().categories]};
  setModel(model')
};

let removeCategory(nam) = {
  try {
    let cats =
      getModel().categories
      |> List.filter((x) => x##name != nam);
    let model' = {...getModel(), categories: cats};
    setModel(model')
  } {
    | Not_found =>
        Js.log2("removeCategory couldn't find category named ", nam);
        getModel()
  }
};

/*let updateCategory(nam, value) = {
  try {
    let cats =
      getModel().categories
      |> List.filter((x) => x##name != nam);
    let model' = {...getModel(), categories: cats};
    model.contents = model';
  } {
    | Not_found =>
        Js.log2("updateCategory couldn't find category named ", nam);
  };
  Js.log2("Adding category with amount ", value##amount);
  addCategory(value)
};*/

let getPaymentsForPeriod(date: Date.t, period): array(Payment.t) = {
  open Spending_category;
  let year = date##getFullYear();
  let month = date##getMonth();
  let dayOfMonth = date##getDate();
  let (start, stop) =
    switch(period) {
    | Monthly =>
        let month = Date.int_of_month(month);
        (Date.make(year, month, 1), Date.make(year, (month + 1) mod 12, 0))
    | Daily =>
        let next =
          Date.date_of_float(float_of_int(Date.int_of_date(date)) +. float_of_int(1000 * 3600 * 24));
        let month = Date.int_of_month(month);
        (Date.make(year, month, dayOfMonth), next)
    | Weekly =>
        let day = date##getDay();
        let dateMs = float_of_int(Date.int_of_date(date));
        let ms = (1000.0 *. 60. *. 60. *. 24.) *. float_of_int(Date.int_of_day(day));
        let firstDay = Date.date_of_float(dateMs -. ms);
        (firstDay, Date.date_of_float(dateMs +. float_of_int(1000 * 3600 * 24 * 7)))
    };
  let payments = model.contents.payments;
  List.filter(
    (x) => {
      Js.log2("Testing payment ", x);
      Date.Infix.(x##date < stop && start < x##date)
    }
    , payments)
  |> Array.of_list
};

let getBillsForMonth(year, month): array(Payment.t) = {
  let allBills = getModel().bills;
  let startingOn = Date.make(year, month, 0);
  Js.log2("length of bills: ", List.length(allBills));
  let tmp =
    List.map(
      (bill) => {
        open Date;
        let outerTest = beginningOfNextMonth(make(year, month, 1));
        if (Infix.(bill.Bill.firstDue < outerTest)) {
          switch bill.Bill.schedule {
          | Bill.Fixed(days) =>
              let rec aux(current) =
                if (Infix.(current < startingOn)) {
                  let millis = float_of_int(days) *. (1000. *. 60. *. 60. *. 24.);
                  aux(Infix.(current + millis));
                } else {
                  if (Infix.(Date.beginningOfMonth(current) < current)) {
                    if (Infix.(current < outerTest)) {
                      let millis = float_of_int(days) *. (1000. *. 60. *. 60. *. 24.);
                      let next = Infix.(current + millis);
                      let existing =
                        try { Some(List.find(
                          (pymnt) => {
                            open Payment;
                            let isCurrent = (
                                  pymnt##date##getMonth() == current##getMonth()
                              &&  pymnt##date##getFullYear() == current##getFullYear()
                              &&  pymnt##date##getDate() == current##getDate());
                            switch pymnt##about {
                            | BillPayment(bill') => (bill' == bill) && isCurrent
                            | OtherPayment(_) => false
                            }
                          },
                          model.contents.payments
                        ))} {
                          | _ => None
                        };
                      let payment =
                        switch (existing) {
                        | Some(x) => x
                        | None =>
                            Payment.make(
                              bill.Bill.category,
                              Bill.getAmount(bill),
                              current,
                              false,
                              Payment.BillPayment(bill));
                        };
                      [payment, ...aux(next)]
                    } else {
                      []
                    }
                  } else {
                    []
                  }
                };
              aux(bill.Bill.firstDue)
          | Bill.MonthlyInterval(x) =>
              let current = Date.make(year, month, x);
              let existing =
                try { Some(List.find(
                  (pymnt) => {
                    open Payment;
                    let isCurrent = (
                          pymnt##date##getMonth() == current##getMonth()
                      &&  pymnt##date##getFullYear() == current##getFullYear()
                      &&  pymnt##date##getDate() == current##getDate());
                    switch pymnt##about {
                    | BillPayment(bill') => (bill' == bill) && isCurrent
                    | OtherPayment(_) => false
                    }
                  },
                  model.contents.payments
                ))} {
                  | _ => None
                };
              let payment =
                switch (existing) {
                | Some(x) => Js.log("Found a paid bill"); x
                | None =>
                    Payment.make(
                      bill.Bill.category,
                      Bill.getAmount(bill),
                      current,
                      false,
                      Payment.BillPayment(bill));
                };
              [ payment ]
          | Bill.Weekly(day) =>
              let firstDayOfMonth = Date.make(year, month, 1);
              let w = firstDayOfMonth##getDay();
              raise(Failure("Finish writing model"))
          | _ =>
              []
          }
        } else {
          Js.log4("Failing outermost test: ", bill.Bill.firstDue##toDateString(), " ", outerTest);
          []
        }
      },
      allBills
    );
  Array.of_list(List.flatten(tmp))
};