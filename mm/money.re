module Currency = {
  [@bs.deriving accessors]
  type t =
    | Usd
    | Gbp
    | Eur;

  let toString(t) =
    switch t {
    | Usd => "$"
    | Gbp | Eur => "TODO: add symbols for other currencies"
    }
};

type t = {
  currency: Currency.t,
  amount: float
};

let getAmount(t) = t.amount;

let makeUsd(x) = {currency: Currency.Usd, amount: x};

let toString(t) = {
  let prefix = Currency.toString(t.currency);
  let num = Printf.sprintf("%.2f", t.amount);
  prefix ++ num
};