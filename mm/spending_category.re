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

let make(name, period, amount, color): t =
  {"name": name, "period": period, "amount": amount, "color": color};

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