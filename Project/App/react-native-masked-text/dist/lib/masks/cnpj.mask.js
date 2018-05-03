Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined;}else{return get(parent,property,receiver);}}else if("value"in desc){return desc.value;}else{var getter=desc.get;if(getter===undefined){return undefined;}return getter.call(receiver);}};var _base=require('./_base.mask');var _base2=_interopRequireDefault(_base);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}

var CNPJ_MASK='99.999.999/9999-99';

var validateCnpj=function validateCnpj(cnpj){
var valida=new Array(6,5,4,3,2,9,8,7,6,5,4,3,2);
var dig1=new Number();
var dig2=new Number();
var i=0;

var exp=/\.|\-|\//g;
cnpj=cnpj.toString().replace(exp,'');
var digito=new Number(eval(cnpj.charAt(12)+cnpj.charAt(13)));

for(i=0;i<valida.length;i++){
dig1+=i>0?cnpj.charAt(i-1)*valida[i]:0;
dig2+=cnpj.charAt(i)*valida[i];
}
dig1=dig1%11<2?0:11-dig1%11;
dig2=dig2%11<2?0:11-dig2%11;

return dig1*10+dig2==digito;
};var

CnpjMask=function(_BaseMask){_inherits(CnpjMask,_BaseMask);function CnpjMask(){_classCallCheck(this,CnpjMask);return _possibleConstructorReturn(this,(CnpjMask.__proto__||Object.getPrototypeOf(CnpjMask)).apply(this,arguments));}_createClass(CnpjMask,[{key:'getValue',value:function getValue(




value,settings){
return this.getVMasker().toPattern(value,CNPJ_MASK);
}},{key:'getRawValue',value:function getRawValue(

maskedValue,settings){
return _get(CnpjMask.prototype.__proto__||Object.getPrototypeOf(CnpjMask.prototype),'removeNotNumbers',this).call(this,maskedValue);
}},{key:'validate',value:function validate(

value,settings){
var isEmpty=(value||'').trim().length===0;
return!isEmpty&&validateCnpj(value);
}}],[{key:'getType',value:function getType(){return'cnpj';}}]);return CnpjMask;}(_base2.default);exports.default=CnpjMask;