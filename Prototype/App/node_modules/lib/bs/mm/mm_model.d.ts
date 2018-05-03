export var model: any ;
export var stateManagers: any ;
export var getModel: (param : any) => any ;
export var setModel: (x : any) => any ;
export var addStateManager: (name : any, func : any) => any ;
export var removeStateManager: (name : any) => any ;
export var getCategoryColor: (cat : any) => any ;
export var addBill:
  (owedTo : any, schedule : any, amount : any, startingOn : any,
  category : any) => any ;
export var finalizePayment: (x : any) => any ;
export var getCategoriesArray: (param : any) => any ;
export var getCategoryByName: (name : any) => any ;
export var addCategory: (nam : any) => any ;
export var removeCategory: (nam : any) => any ;
export var getPaymentsForPeriod: (date : any, period : any) => any ;
export var getBillsForMonth: (year : any, month : any) => any ;

