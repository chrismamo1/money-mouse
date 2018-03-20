type t =
  { balance: list(Money.t)
  , bills: list(Bill.t)
  };

let model =
  ref(
    { balance: [Money.({currency: Currency.USD, amount: 1000.0})]
    , bills: []
    });

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