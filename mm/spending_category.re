type t =
  Js.t({
    .
    name: string
  , period: [ `Monthly | `Weekly | `Daily ]
  , amount: float
  });

let make(name, period, amount): t =
  {"name": name, "period": period, "amount": amount};