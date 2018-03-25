[@bs.deriving accessors]
type paymentDescriptor =
  | BillPayment(Bill.t)
  | OtherPayment(string);

type t =
  Js.t({
    .
    id: int
  , category: string
  , amount: Money.t
  , date: Date.t
  , filled: bool
  , about: paymentDescriptor
  });

let make(cat, amt, date, filled, about): t =
  { "id": [%bs.raw {|((Math.random() * 1e10) | 0)|}]
  , "category": cat
  , "amount": amt
  , "date": date
  , "filled": filled
  , "about": about
  };

let getBill(t) =
  switch t##about {
  | BillPayment(bill) => bill
  | OtherPayment(_) => raise(Failure("Cannot get bill: wrong type of payment"))
  };