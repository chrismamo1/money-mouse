module Currency = {
  type t =
    | USD
    | GBP
    | EUR;
};

type t = {
  currency: Currency.t,
  amount: float
};