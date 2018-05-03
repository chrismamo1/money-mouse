[@bs.deriving accessors]
type period =
  | Monthly
  | Weekly
  | Daily;

type t =
  Js.t({
    .
    name: string
  , period: period
  , amount: float
  , color: string
  });

let colors = [
  "#df7a7a",
  "#7adf7a",
  "#74d9da",
  "#7a7adf",
  "#d9da74",
  "#d974da",
  "#dad974"
];

let make(~color, name, period, amount): t =
  {"name": name, "period": period, "amount": amount, "color": color};

let getFormattedAmountString(t) = {
  let intPart = int_of_float(t##amount);
  let rec aux(acc, x) =
    switch (x mod 1_000) {
    | 0 => acc
    | n => aux([string_of_int(n), ...acc], x / 1_000)
    };
  let parts = aux([], intPart);
  let wholePart = String.concat(",", parts);
  let decPart = String.sub(Printf.sprintf("%.2f", t##amount -. float_of_int(intPart)), 1, 3);
  let rv = "$" ++ wholePart ++ decPart;
  rv
};

let getPeriodString(t) =
  switch (t##period) {
  | Monthly => "Monthly"
  | Weekly => "Weekly"
  | Daily => "Daily"
  };

let period_of_string(s) =
  switch (s) {
  | "Monthly" => Monthly
  | "Weekly" => Weekly
  | "Daily" => Daily
  | _ => raise(Failure("Unrecognized period string: " ++ s))
  };

let rec summarizePeriod(date: Date.t, period) =
  switch period {
  | Daily =>
      Date.dayToString(date##getDay())
      ++ " "
      ++ Date.monthToString(date##getMonth())
      ++ " "
      ++ string_of_int(date##getDate())
      ++ ", "
      ++ string_of_int(date##getFullYear())
  | Weekly =>
      let day = date##getDay();
      let dateMs = float_of_int(Date.int_of_date(date));
      let ms = (1000.0 *. 60. *. 60. *. 24.) *. float_of_int(Date.int_of_day(day));
      let firstDay = Date.date_of_float(dateMs -. ms);
      let weekSummary = summarizePeriod(firstDay, Daily);
      "the week of " ++ weekSummary
  | Monthly =>
      let name = Date.monthToString(date##getMonth());
      "the month of " ++ name ++ " " ++ string_of_int(date##getFullYear())
  };