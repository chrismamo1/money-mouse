[@bs.deriving accessors]
type paymentSchedule =
  | Fixed(int) /** time between payments in days */
  | Weekly(Date.day)
    /** on a certain day every month, e.g. (Monday, 0) is the 1st Monday
      * of the month.
      */
  | MonthlyInterval(int);

let fillSchedule(startingOn: Date.t, endingOn: Date.t, sched: paymentSchedule) =
  switch sched {
  | Fixed(days) =>
      let days = float_of_int(days);
      let startingOn =
        Date.(make(
          startingOn##getFullYear(),
          int_of_month(startingOn##getMonth()),
          int_of_day(startingOn##getDay())));
      let endingOn =
        Date.(make(
          endingOn##getFullYear(),
          int_of_month(endingOn##getMonth()),
          int_of_day(endingOn##getDay())));
      let diff = Date.Infix.(endingOn - startingOn);
      let n = diff /. (days *. Date.dayOfMillis);
      Array.init(
        int_of_float(n) + 1,
        (i) => {
          let amt = days *. Date.dayOfMillis *. float_of_int(i);
          Date.(Infix.(startingOn + amt))
        })
  | MonthlyInterval(day) =>
      let beginningOfFirstMonth = Date.beginningOfMonth(startingOn);
      let rec aux(acc, it) = {
        let newDate = Date.(make(it##getFullYear(), int_of_month(it##getMonth()), day));
        if (Date.Infix.(endingOn < newDate)) {
          acc
        } else {
          aux([newDate, ...acc], Date.beginningOfNextMonth(it))
        }
      };
      Array.of_list(List.rev(aux([], beginningOfFirstMonth)))
  | Weekly(_) =>
      raise(Failure("Please get rid of the weekly scheduling thingy."))
  };

type t =
  { firstDue: Date.t
  , schedule: paymentSchedule
  , description: string
  , owedTo: string
  , method: [ `Cash | `Wire | `CC | `Debit ]
  , amount: [ `Fixed(Money.t) ]
  , category: string
  };

let getAmount(t) =
  switch t.amount {
  | `Fixed(x) => x
  };

let getOwedTo(t) = t.owedTo;

let getCategory(t) = t.category;

let getDescription(t) = t.description;