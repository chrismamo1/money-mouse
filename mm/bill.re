[@bs.deriving accessors]
type paymentSchedule =
  | Fixed(int) /** time between payments in days */
  | Weekly(Date.day)
    /** on a certain day every month, e.g. (Monday, 0) is the 1st Monday
      * of the month.
      */
  | MonthlyInterval(int);

type t =
  { firstDue: Date.t
  , schedule: paymentSchedule
  , description: string
  , owedTo: string
  , method: [ `Cash | `Wire | `CC | `Debit ]
  , amount: [ `Fixed(Money.t) ]
  , history: list((Date.t, Money.t, string))
  };
