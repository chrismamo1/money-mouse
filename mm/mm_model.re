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
      [ Spending_category.make("Rent", Monthly, 250.0, "#ffaaaa")
      , Spending_category.make("Gas", Daily, 10.0, "#aaffaa")
      , Spending_category.make("Groceries", Weekly, 30.0, "#aaffff")
      , Spending_category.make("Eating Out", Monthly, 200.0, "#aaaaff")
      ]
    , payments: []
    });

let getCategoryColor(cat) = {
  try {
    let cat = List.find((x) => x##name == cat, model.contents.categories);
    cat##color
  } {
    | Not_found => "#ffffff"
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
  model.contents = {...model.contents, bills: [bill, ...model.contents.bills]};
};

let finalizePayment(x: Payment.t) = {
  open Payment;
  let model' = {...model.contents, payments: [x, ...model.contents.payments]};
  model.contents = model';
  Js.log2("Model: ", model.contents);
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

let getCategoriesArray() = Array.of_list(model.contents.categories);

let getCategoryByName(name) =
  List.find((cat) => cat##name == name, model.contents.categories);

let addCategory(nam) = {
  let model' = {...model.contents, categories: [nam, ...model.contents.categories]};
  model.contents = model'
};

let removeCategory(nam) = {
  let cats =
    model.contents.categories
    |> List.filter((x) => x##name != nam);
  let model' = {...model.contents, categories: cats};
  model.contents = model'
};

let updateCategory(nam, value) = {
  removeCategory(nam);
  Js.log2("Adding category with amount ", value##amount);
  addCategory(value)
};

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
  let allBills = model.contents.bills;
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