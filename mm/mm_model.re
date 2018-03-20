type t =
  { balance: list(Money.t)
  , bills: list(Bill.t)
  , categories: list(Spending_category.t)
  , purchases: list((string, string, float, Date.t))
  };

let model =
  ref(
    { balance: [Money.({currency: Currency.USD, amount: 1000.0})]
    , bills: []
    , categories:
      [ Spending_category.make("Rent", `Monthly, 250.0)
      , Spending_category.make("Gas", `Daily, 10.0)
      , Spending_category.make("Groceries", `Weekly, 30.0)
      , Spending_category.make("Eating Out", `Monthly, 200.0)
      ]
    , purchases: []
    });

let getCategoriesArray() = Array.of_list(model.contents.categories);

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

let addBill(owedTo, schedule, amount, startingOn) = {
  let bill =
    Bill.{
      firstDue: startingOn
    , schedule: schedule
    , owedTo: owedTo
    , method: `Cash
    , amount: amount
    , history: []
    , description: ""
    };
  model.contents = {...model.contents, bills: [bill, ...model.contents.bills]};
};

let getBillsForMonth(year, month): array(Date.t) = {
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
                    let millis = days * (1000 * 60 * 60 * 24);
                    let next = Infix.(current + millis);
                    [current, ...aux(next)]
                  } else {
                    []
                  }
                } else {
                  []
                };
              aux(bill.Bill.firstDue)
          | Bill.MonthlyInterval(x) =>
              [Date.make(year, month, x)]
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