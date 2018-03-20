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
  [@bs.meth] getDay: unit => int,
  [@bs.meth] getMonth: unit => int,
  [@bs.meth] getFullYear: unit => int,
  [@bs.meth] toDateString: unit => string
});

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

let date_of_int: (int) => t = [%bs.raw {|function(x) { new Date(x) }|}];

let beginningOfMonth(t) = {
  let aux: (int, int) => t = [%bs.raw {|((y, m) => new Date(y, m, 1))|}];
  aux(t##getFullYear(), t##getMonth())
};

let beginningOfNextMonth(t) = {
  let aux: (int, int) => t = [%bs.raw {|((y, m) => new Date(y, m, 1))|}];
  aux(t##getFullYear(), (t##getMonth()) + 1)
};

let make(year, month, day) = {
  let aux: (int, int, int) => t = [%bs.raw {|((y, m, d) => new Date(y, m, d))|}];
  aux(year, month, day)
};

module Infix = {
  let (-)(a, b) = {
    let f': (t, t) => float = [%bs.raw {|function(a, b) {
      if (a instanceof Date && b instanceof Date) {
        return a - b;
      } else {
        return NaN;
      }
    }|}];
    switch (f'(a, b)) {
    | x when x === nan => raise(Failure("Invalid types in date difference operation"))
    | x => int_of_float(x)
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
    let f': (t, int) => t = [%bs.raw {|function(a, b) {
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