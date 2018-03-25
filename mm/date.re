[@bs.deriving accessors]
type month =
  | January
  | February
  | March
  | April
  | May
  | June
  | July
  | August
  | September
  | October
  | November
  | December;

[@bs.deriving accessors]
type day =
  | Sunday
  | Monday
  | Tuesday
  | Wednesday
  | Thursday
  | Friday
  | Saturday;

type t = Js.t({
  .
  [@bs.meth] getDate: unit => int,
  [@bs.meth] getDay: unit => day,
  [@bs.meth] getMonth: unit => month,
  [@bs.meth] getFullYear: unit => int,
  [@bs.meth] toDateString: unit => string
});

let int_of_month(month) =
  switch month {
  | January => 0
  | February => 1
  | March => 2
  | April => 3
  | May => 4
  | June => 5
  | July => 6
  | August => 7
  | September => 8
  | October => 9
  | November => 10
  | December => 11
  };

let int_of_day(day) =
  switch (day) {
  | Sunday => 0
  | Monday => 1
  | Tuesday => 2
  | Wednesday => 3
  | Thursday => 4
  | Friday => 5
  | Saturday => 6
  };

let dayOfMillis = 24.0 *. 60.0 *. 60.0 *. 1_000.0;

let date_of_int: (int) => t = [%bs.raw {|function(x) { return new Date(x) }|}];

let date_of_float: (float) => t = [%bs.raw {|function(x) { return new Date(x) }|}];

let int_of_date: (t) => int = [%bs.raw {|((x) => x - 0)|}];

let beginningOfMonth(t) = {
  let aux: (int, int) => t = [%bs.raw {|((y, m) => new Date(y, m, 1))|}];
  aux(t##getFullYear(), int_of_month(t##getMonth()))
};

let beginningOfNextMonth(t) = {
  let aux: (int, int) => t = [%bs.raw {|((y, m) => new Date(y, m, 1))|}];
  /* don't need to handle months here because the JS Date constructor does it
     automatically */
  aux(t##getFullYear(), int_of_month((t##getMonth())) + 1)
};

let make(year, month, day) = {
  let aux: (int, int, int) => t = [%bs.raw {|((y, m, d) => new Date(y, m, d))|}];
  aux(year, month, day)
};

module Infix = {
  let (-)(a: t, b: t): float = {
    let f': (t, t) => float = [%bs.raw {|function(a, b) {
      if (a instanceof Date && b instanceof Date) {
        return a - b;
      } else {
        return NaN;
      }
    }|}];
    switch (f'(a, b)) {
    | x when x === nan => raise(Failure("Invalid types in date difference operation"))
    | x => x
    }
  };

  let (<)(a, b): bool = {
    let f': (t, t) => bool = [%bs.raw {|function(a, b) {
      if (a instanceof Date && b instanceof Date) {
        return a < b;
      } else {
        throw(new Exception());
      }
    }|}];
    f'(a, b)
  };

  let (+)(a, b): t = {
    let f': (t, float) => t = [%bs.raw {|function(a, b) {
      if (a instanceof Date) {
        return new Date((a - 0) + b);
      } else {
        return NaN;
      }
    }|}];
    f'(a, b)
  };
};

let now(): t = [%bs.raw {|new Date()|}];

let dayToString(day) =
  switch (day) {
  | Sunday => "Sunday"
  | Monday => "Monday"
  | Tuesday => "Tuesday"
  | Wednesday => "Wednesday"
  | Thursday => "Thursday"
  | Friday => "Friday"
  | Saturday => "Saturday"
  };

let dateToString(t) = t##getFullYear() ++ "-" ++ string_of_int(int_of_month(t##getMonth()) + 1) ++ "-" ++ t##getDate();

let monthToString(month) =
  switch month {
  | January => "January"
  | February => "February"
  | March => "March"
  | April => "April"
  | May => "May"
  | June => "June"
  | July => "July"
  | August => "August"
  | September => "September"
  | October => "October"
  | November => "November"
  | December => "December"
  };