!function(){"use strict";function inspect(obj,opts){var ctx={seen:[],stylize:stylizeNoColor};return arguments.length>=3&&(ctx.depth=arguments[2]),arguments.length>=4&&(ctx.colors=arguments[3]),isBoolean(opts)?ctx.showHidden=opts:opts&&util._extend(ctx,opts),isUndefined(ctx.showHidden)&&(ctx.showHidden=!1),isUndefined(ctx.depth)&&(ctx.depth=2),isUndefined(ctx.colors)&&(ctx.colors=!1),isUndefined(ctx.customInspect)&&(ctx.customInspect=!0),ctx.colors&&(ctx.stylize=stylizeWithColor),formatValue(ctx,obj,ctx.depth)}function stylizeWithColor(str,styleType){var style=inspect.styles[styleType];return style?"["+inspect.colors[style][0]+"m"+str+"["+inspect.colors[style][1]+"m":str}function stylizeNoColor(str,styleType){return str}function arrayToHash(array){var hash={};return array.forEach(function(val,idx){hash[val]=!0}),hash}function formatValue(ctx,value,recurseTimes){if(ctx.customInspect&&value&&isFunction(value.inspect)&&value.inspect!==util.inspect&&(!value.constructor||value.constructor.prototype!==value)){var ret=value.inspect(recurseTimes,ctx);return isString(ret)||(ret=formatValue(ctx,ret,recurseTimes)),ret}var primitive=formatPrimitive(ctx,value);if(primitive)return primitive;var keys=Object.keys(value),visibleKeys=arrayToHash(keys);ctx.showHidden&&(keys=Object.getOwnPropertyNames(value));var formatted,raw=value;try{isDate(value)||(raw=value.valueOf())}catch(e){}if(isString(raw)&&(keys=keys.filter(function(key){return!(key>=0&&key<raw.length)})),0===keys.length){if(isFunction(value)){var name=value.name?": "+value.name:"";return ctx.stylize("[Function"+name+"]","special")}if(isRegExp(value))return ctx.stylize(RegExp.prototype.toString.call(value),"regexp");if(isDate(value))return ctx.stylize(Date.prototype.toString.call(value),"date");if(isError(value))return formatError(value);if(isString(raw))return formatted=formatPrimitiveNoColor(ctx,raw),ctx.stylize("[String: "+formatted+"]","string");if(isNumber(raw))return formatted=formatPrimitiveNoColor(ctx,raw),ctx.stylize("[Number: "+formatted+"]","number");if(isBoolean(raw))return formatted=formatPrimitiveNoColor(ctx,raw),ctx.stylize("[Boolean: "+formatted+"]","boolean")}var base="",array=!1,braces=["{","}"];if(isArray(value)&&(array=!0,braces=["[","]"]),isFunction(value)){var n=value.name?": "+value.name:"";base=" [Function"+n+"]"}if(isRegExp(value)&&(base=" "+RegExp.prototype.toString.call(value)),isDate(value)&&(base=" "+Date.prototype.toUTCString.call(value)),isError(value)&&(base=" "+formatError(value)),isString(raw)&&(formatted=formatPrimitiveNoColor(ctx,raw),base=" [String: "+formatted+"]"),isNumber(raw)&&(formatted=formatPrimitiveNoColor(ctx,raw),base=" [Number: "+formatted+"]"),isBoolean(raw)&&(formatted=formatPrimitiveNoColor(ctx,raw),base=" [Boolean: "+formatted+"]"),0===keys.length&&(!array||0===value.length))return braces[0]+base+braces[1];if(0>recurseTimes)return isRegExp(value)?ctx.stylize(RegExp.prototype.toString.call(value),"regexp"):ctx.stylize("[Object]","special");ctx.seen.push(value);var output;return output=array?formatArray(ctx,value,recurseTimes,visibleKeys,keys):keys.map(function(key){return formatProperty(ctx,value,recurseTimes,visibleKeys,key,array)}),ctx.seen.pop(),reduceToSingleString(output,base,braces)}function formatPrimitive(ctx,value){if(isUndefined(value))return ctx.stylize("undefined","undefined");if(isString(value)){var simple="'"+JSON.stringify(value).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return ctx.stylize(simple,"string")}return isNumber(value)?0===value&&0>1/value?ctx.stylize("-0","number"):ctx.stylize(""+value,"number"):isBoolean(value)?ctx.stylize(""+value,"boolean"):isNull(value)?ctx.stylize("null","null"):isSymbol(value)?ctx.stylize(value.toString(),"symbol"):void 0}function formatPrimitiveNoColor(ctx,value){var stylize=ctx.stylize;ctx.stylize=stylizeNoColor;var str=formatPrimitive(ctx,value);return ctx.stylize=stylize,str}function formatError(value){return"["+Error.prototype.toString.call(value)+"]"}function formatArray(ctx,value,recurseTimes,visibleKeys,keys){for(var output=[],i=0,l=value.length;l>i;++i)hasOwnProperty(value,String(i))?output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,String(i),!0)):output.push("");return keys.forEach(function(key){key.match(/^\d+$/)||output.push(formatProperty(ctx,value,recurseTimes,visibleKeys,key,!0))}),output}function formatProperty(ctx,value,recurseTimes,visibleKeys,key,array){var name,str,desc;if(desc=Object.getOwnPropertyDescriptor(value,key)||{value:value[key]},desc.get?str=desc.set?ctx.stylize("[Getter/Setter]","special"):ctx.stylize("[Getter]","special"):desc.set&&(str=ctx.stylize("[Setter]","special")),hasOwnProperty(visibleKeys,key)||(name="["+key+"]"),str||(ctx.seen.indexOf(desc.value)<0?(str=isNull(recurseTimes)?formatValue(ctx,desc.value,null):formatValue(ctx,desc.value,recurseTimes-1),str.indexOf("\n")>-1&&(str=array?str.split("\n").map(function(line){return"  "+line}).join("\n").substr(2):"\n"+str.split("\n").map(function(line){return"   "+line}).join("\n"))):str=ctx.stylize("[Circular]","special")),isUndefined(name)){if(array&&key.match(/^\d+$/))return str;name=JSON.stringify(""+key),name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(name=name.substr(1,name.length-2),name=ctx.stylize(name,"name")):(name=name.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'").replace(/\\\\/g,"\\"),name=ctx.stylize(name,"string"))}return name+": "+str}function reduceToSingleString(output,base,braces){var length=output.reduce(function(prev,cur){return prev+cur.replace(/\u001b\[\d\d?m/g,"").length+1},0);return length>60?braces[0]+(""===base?"":base+"\n ")+" "+output.join(",\n  ")+" "+braces[1]:braces[0]+base+" "+output.join(", ")+" "+braces[1]}function isBoolean(arg){return"boolean"==typeof arg}function isNull(arg){return null===arg}function isNullOrUndefined(arg){return null==arg}function isNumber(arg){return"number"==typeof arg}function isString(arg){return"string"==typeof arg}function isSymbol(arg){return"symbol"==typeof arg}function isUndefined(arg){return void 0===arg}function isRegExp(re){return isObject(re)&&"[object RegExp]"===objectToString(re)}function isObject(arg){return"object"==typeof arg&&null!==arg}function isDate(d){return isObject(d)&&"[object Date]"===objectToString(d)}function isError(e){return isObject(e)&&("[object Error]"===objectToString(e)||e instanceof Error)}function isFunction(arg){return"function"==typeof arg}function isPrimitive(arg){return null===arg||"boolean"==typeof arg||"number"==typeof arg||"string"==typeof arg||"symbol"==typeof arg||"undefined"==typeof arg}function isBuffer(arg){return arg instanceof Buffer}function objectToString(o){return Object.prototype.toString.call(o)}function pad(n){return 10>n?"0"+n.toString(10):n.toString(10)}function timestamp(){var d=new Date,time=[pad(d.getHours()),pad(d.getMinutes()),pad(d.getSeconds())].join(":");return[d.getDate(),months[d.getMonth()],time].join(" ")}function hasOwnProperty(obj,prop){return Object.prototype.hasOwnProperty.call(obj,prop)}function EventEmitter(){EventEmitter.init.call(this)}function Repository(config){if(EventEmitter.call(this),config instanceof RepositoryConfig==!1)throw new Error("Invalid config");if(!config.dataProvider)throw new Error("You must specify a data provider");this.contexts={},this.config=config,this.dataProvider=this.config.dataProvider,this.name=this.config.name}function QueryFilter(){EventEmitter.call(this),this._filters=[],this.operatorsArray=Object.keys(this.operators).map(function(key){return this.operators[key]},this)}function QueryBuilder(resourceName){EventEmitter.call(this),this._filter=new QueryFilter,this._sorting=new QuerySorting,this._pagination=new QueryPagination,this.resourceName=resourceName||null}function QueryPagination(){EventEmitter.call(this),this.reset()}function QuerySorting(){EventEmitter.call(this),this._sorting=[]}function ContextEventEmitter(){EventEmitter.call(this),this._pauseEvents=!1,this._queue=[]}function Context(name){EventEmitter.call(this);var query=this.createQuery();return this.name=name,this.data=null,this.error=null,this.query=query,query.on("update",function(context){this.emit("update")}.bind(this)),this}function ContextQueryBuilder(){function onUpdateFn(){this.emit("update")}QueryBuilder.call(this);var updateFn=onUpdateFn.bind(this);this._filter.on("update",updateFn),this._sorting.on("update",updateFn),this._pagination.on("update",updateFn)}function DataProvider(){EventEmitter.call(this)}function RepositoryConfig(config){if(!config.name)throw new Error("Invalid resource name");if(config.dataProvider instanceof DataProvider==!1)throw new Error("Invalid data provider");util.extend(this,config)}var util={},process={noDeprecation:!0,env:{NODE_DEBUG:1}},global={process:process};util.isFloat=function(n){return n===Number(n)&&n%1!==0},util.missing=function(method){return function(){throw new Error("Method "+method+" not implemented")}},util.toArray=function(value){return Array.prototype.slice.apply(value)};var formatRegExp=/%[sdj%]/g;util.format=function(f){if(!isString(f)){for(var objects=[],i=0;i<arguments.length;i++)objects.push(inspect(arguments[i]));return objects.join(" ")}for(var i=1,args=arguments,len=args.length,str=String(f).replace(formatRegExp,function(x){if("%%"===x)return"%";if(i>=len)return x;switch(x){case"%s":return String(args[i++]);case"%d":return Number(args[i++]);case"%j":try{return JSON.stringify(args[i++])}catch(_){return"[Circular]"}default:return x}}),x=args[i];len>i;x=args[++i])str+=isNull(x)||!isObject(x)?" "+x:" "+inspect(x);return str},util.deprecate=function(fn,msg){function deprecated(){if(!warned){if(process.throwDeprecation)throw new Error(msg);process.traceDeprecation?console.trace(msg):console.error(msg),warned=!0}return fn.apply(this,arguments)}if(isUndefined(global.process))return function(){return util.deprecate(fn,msg).apply(this,arguments)};if(process.noDeprecation===!0)return fn;var warned=!1;return deprecated};var debugEnviron,debugs={};util.debuglog=function(set){if(isUndefined(debugEnviron)&&(debugEnviron=process.env.NODE_DEBUG||""),set=set.toUpperCase(),!debugs[set])if(new RegExp("\\b"+set+"\\b","i").test(debugEnviron)){var pid=process.pid;debugs[set]=function(){var msg=util.format.apply(util,arguments);console.error("%s %d: %s",set,pid,msg)}}else debugs[set]=function(){};return debugs[set]},util.inspect=inspect,inspect.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},inspect.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",symbol:"green",date:"magenta",regexp:"red"};var isArray=util.isArray=Array.isArray;util.isBoolean=isBoolean,util.isNull=isNull,util.isNullOrUndefined=isNullOrUndefined,util.isNumber=isNumber,util.isString=isString,util.isSymbol=isSymbol,util.isUndefined=isUndefined,util.isRegExp=isRegExp,util.isObject=isObject,util.isDate=isDate,util.isError=isError,util.isFunction=isFunction,util.isPrimitive=isPrimitive,util.isBuffer=isBuffer;var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];util.log=function(){console.log("%s - %s",timestamp(),util.format.apply(util,arguments))},util.inherits=function(ctor,superCtor,attributes){ctor.super_=superCtor,ctor.prototype=Object.create(superCtor.prototype,{constructor:{value:ctor,enumerable:!1,writable:!0,configurable:!0}}),isObject(attributes)&&util.extend(ctor.prototype,attributes)},util._extend=function(origin,add){if(!add||!isObject(add))return origin;for(var keys=Object.keys(add),i=keys.length;i--;)origin[keys[i]]=add[keys[i]];return origin},util.extend=util._extend,util.p=util.deprecate(function(){for(var i=0,len=arguments.length;len>i;++i)console.error(util.inspect(arguments[i]))},"util.p: Use console.error() instead"),util.print=util.deprecate(function(){for(var i=0,len=arguments.length;len>i;++i)process.stdout.write(String(arguments[i]))},"util.print: Use console.log instead"),util.puts=util.deprecate(function(){for(var i=0,len=arguments.length;len>i;++i)process.stdout.write(arguments[i]+"\n")},"util.puts: Use console.log instead"),util.debug=util.deprecate(function(x){process.stderr.write("DEBUG: "+x+"\n")},"util.debug: Use console.error instead"),util.error=util.deprecate(function(x){for(var i=0,len=arguments.length;len>i;++i)process.stderr.write(arguments[i]+"\n")},"util.error: Use console.error instead"),util.pump=util.deprecate(function(readStream,writeStream,callback){function call(a,b,c){callback&&!callbackCalled&&(callback(a,b,c),callbackCalled=!0)}var callbackCalled=!1;readStream.addListener("data",function(chunk){writeStream.write(chunk)===!1&&readStream.pause()}),writeStream.addListener("drain",function(){readStream.resume()}),readStream.addListener("end",function(){writeStream.end()}),readStream.addListener("close",function(){call()}),readStream.addListener("error",function(err){writeStream.end(),call(err)}),writeStream.addListener("error",function(err){readStream.destroy(),call(err)})},"util.pump(): Use readableStream.pipe() instead");var uv;util._errnoException=function(err,syscall,original){isUndefined(uv)&&(uv=process.binding("uv"));var errname=uv.errname(err),message=syscall+" "+errname;original&&(message+=" "+original);var e=new Error(message);return e.code=errname,e.errno=errname,e.syscall=syscall,e},EventEmitter.EventEmitter=EventEmitter,EventEmitter.usingDomains=!1,EventEmitter.prototype.domain=void 0,EventEmitter.prototype._events=void 0,EventEmitter.prototype._maxListeners=void 0,EventEmitter.defaultMaxListeners=10,EventEmitter.init=function(){this.domain=null,this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events={}),this._maxListeners=this._maxListeners||void 0},EventEmitter.prototype.setMaxListeners=function(n){if(!util.isNumber(n)||0>n||isNaN(n))throw TypeError("n must be a positive number");return this._maxListeners=n,this},EventEmitter.prototype.emit=function(type){var er,handler,len,args,i,listeners;if(this._events||(this._events={}),"error"===type&&!this._events.error){if(er=arguments[1],!this.domain)throw er instanceof Error?er:Error('Uncaught, unspecified "error" event.');return er||(er=new Error('Uncaught, unspecified "error" event.')),er.domainEmitter=this,er.domain=this.domain,er.domainThrown=!1,this.domain.emit("error",er),!1}if(handler=this._events[type],util.isUndefined(handler))return!1;if(this.domain&&this!==process&&this.domain.enter(),util.isFunction(handler))switch(arguments.length){case 1:handler.call(this);break;case 2:handler.call(this,arguments[1]);break;case 3:handler.call(this,arguments[1],arguments[2]);break;default:for(len=arguments.length,args=new Array(len-1),i=1;len>i;i++)args[i-1]=arguments[i];handler.apply(this,args)}else if(util.isObject(handler)){for(len=arguments.length,args=new Array(len-1),i=1;len>i;i++)args[i-1]=arguments[i];for(listeners=handler.slice(),len=listeners.length,i=0;len>i;i++)listeners[i].apply(this,args)}return this.domain&&this!==process&&this.domain.exit(),!0},EventEmitter.prototype.addListener=function(type,listener){var m;if(!util.isFunction(listener))throw TypeError("listener must be a function");if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",type,util.isFunction(listener.listener)?listener.listener:listener),this._events[type]?util.isObject(this._events[type])?this._events[type].push(listener):this._events[type]=[this._events[type],listener]:this._events[type]=listener,util.isObject(this._events[type])&&!this._events[type].warned){var m;m=util.isUndefined(this._maxListeners)?EventEmitter.defaultMaxListeners:this._maxListeners,m&&m>0&&this._events[type].length>m&&(this._events[type].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d %s listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[type].length,type),console.trace())}return this},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.once=function(type,listener){function g(){this.removeListener(type,g),fired||(fired=!0,listener.apply(this,arguments))}if(!util.isFunction(listener))throw TypeError("listener must be a function");var fired=!1;return g.listener=listener,this.on(type,g),this},EventEmitter.prototype.removeListener=function(type,listener){var list,position,length,i;if(!util.isFunction(listener))throw TypeError("listener must be a function");if(!this._events||!this._events[type])return this;if(list=this._events[type],length=list.length,position=-1,list===listener||util.isFunction(list.listener)&&list.listener===listener)delete this._events[type],this._events.removeListener&&this.emit("removeListener",type,listener);else if(util.isObject(list)){for(i=length;i-->0;)if(list[i]===listener||list[i].listener&&list[i].listener===listener){position=i;break}if(0>position)return this;1===list.length?(list.length=0,delete this._events[type]):list.splice(position,1),this._events.removeListener&&this.emit("removeListener",type,listener)}return this},EventEmitter.prototype.removeAllListeners=function(type){var key,listeners;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[type]&&delete this._events[type],this;if(0===arguments.length){for(key in this._events)"removeListener"!==key&&this.removeAllListeners(key);return this.removeAllListeners("removeListener"),this._events={},this}if(listeners=this._events[type],util.isFunction(listeners))this.removeListener(type,listeners);else if(Array.isArray(listeners))for(;listeners.length;)this.removeListener(type,listeners[listeners.length-1]);return delete this._events[type],this},EventEmitter.prototype.listeners=function(type){var ret;return ret=this._events&&this._events[type]?util.isFunction(this._events[type])?[this._events[type]]:this._events[type].slice():[]},EventEmitter.listenerCount=function(emitter,type){var ret;return ret=emitter._events&&emitter._events[type]?util.isFunction(emitter._events[type])?1:emitter._events[type].length:0},util.inherits(Repository,EventEmitter,{hasContext:function(name){return this.contexts[name]instanceof Context},createContext:function(name){if(!this.hasContext(name)){var context=new Context(name);context.on("update",function(){this.updateContext(context)}.bind(this)),this.contexts[name]=context}return this.getContext(name)},getContext:function(name){return this.contexts[name]},updateContext:function(context){var state=context.toJSON();return this.dataProvider.find(this.name,state).then(function(data){context.setData(data)},function(err){context.setError(err)}),this},removeContext:function(name){return delete this.contexts[name],this},find:function(queryBuilder){if(queryBuilder instanceof QueryBuilder==!1)throw new Error("Invalid query builder");var params=queryBuilder.toJSON();return this.dataProvider.find(this.name,params)},findOne:function(id){return this.dataProvider.findOne(this.name,id)},removeOne:function(id){return this.dataProvider.removeOne(this.name,id)},remove:function(ids){return this.dataProvider.remove(this.name,ids)},saveOne:function(entity){var self=this;return this.dataProvider.saveOne(this.name,entity).then(function(response){return self.emit(self.EVENTS.UPDATE),response})},save:function(entities){if(0===entities.length)return this.dataProvider.error(this.ERRORS.EMPTY_ENTITY_SET);var self=this;return this.dataProvider.save(this.name,entities).then(function(response){return self.emit(self.EVENTS.UPDATE),response})},EVENTS:{UPDATE:"update"},ERRORS:{EMPTY_ENTITY_SET:"EMPTY_ENTITY_SET",INVALID_ENTITY_SET:"INVALID_ENTITY_SET"}}),QueryFilter.create=function(filters){var instance=new QueryFilter;return instance.setState(filters),instance},util.inherits(QueryFilter,EventEmitter,{reset:function(){this._filters=[]},where:function(name,operator,value){return 2===arguments.length&&(value=operator,operator=this.operators.EQ),this.hasOperator(operator)?(this.addFilter(name,operator,value),this):this},hasOperator:function(operator){return this.operatorsArray.indexOf(operator)>-1},remove:function(name){return name?(this._filters.forEach(function(filter,index){filter.name===name&&this._filters.splice(index,1)},this),this):this},addFilter:function(){var filter,args=util.toArray(arguments);if(util.isArray(args[0])&&(args=args[0]),util.isObject(args[0])&&(filter=args[0]),util.isUndefined(filter)&&(filter={name:args[0],operator:args[1],value:args[2]}),!filter)return this;var hasDuplicated=this._filters.some(function(current){return current.name===filter.name&&current.operator===filter.operator});return hasDuplicated?this:(this._filters.push(filter),this)},addFilters:function(filters){if(!util.isArray(filters))throw new Error("Must be an array");return filters.forEach(this.addFilter,this),this},operators:{EQ:"=",LT:"<",LTE:"<=",GT:">",GTE:">=",IN:"in",ST:"^",END:"$",LK:"~"},setState:function(){return this.addFilter.apply(this,arguments)},toJSON:function(){return this._filters.slice()}}),util.inherits(QueryBuilder,EventEmitter,{from:function(resourceName){return this.resourceName=resourceName,this},where:function(){return this._filter.where.apply(this._filter,arguments),this},orderBy:function(){return this._sorting.sort.apply(this._sorting,arguments),this},pagination:function(){return this._pagination},limit:function(limit){return this.pagination().setState({itemsPerPage:limit}),this},toJSON:function(){return{filters:this._filter.toJSON(),pagination:this._pagination.toJSON(),sorting:this._sorting.toJSON()}},reset:function(){return this._filter.reset(),this._sorting.reset(),this._pagination.reset(),this}}),util.extend(QueryBuilder,QueryFilter.prototype.operators),util.inherits(QueryPagination,EventEmitter,{isValidPage:function(page){return page>0&&page<=this.totalPages},next:function(){return this.isValidPage(this.currentPage+1)?(this.setPage(this.currentPage+1),this):this},previous:function(){return this.isValidPage(this.currentPage-1)?(this.setPage(this.currentPage-1),this):this},setPage:function(page){this.currentPage;return this.currentPage=page,this.emit("update"),this},setState:function(config){var totalItems=config.totalItems;if(0!==totalItems&&!util.isUndefined(totalItems)&&isNaN(totalItems))throw new Error("Invalid total items property");return angular.extend(this,config),this.refresh(),this},refresh:function(){(this.currentPage<1||!this.isValidPage(this.currentPage))&&(this.currentPage=this.defaults.currentPage),this.itemsPerPage<1&&(this.itemsPerPage=Math.floor(this.defaults.itemsPerPage)),this.totalItems=this.totalItems||0,this.itemsPerPage=parseInt(this.itemsPerPage),this.totalPages=this.totalItems/this.itemsPerPage,(!this.totalPages||util.isFloat(this.totalPages))&&(this.totalPages=Math.round(this.totalItems/this.itemsPerPage)),this.totalPagesArray=[];for(var i=0;i<this.totalPages.length;i++)this.totalPagesArray.push(i+1)},reset:function(){return this.setState({currentPage:0,itemsPerPage:0,totalItems:0,totalPages:0}),this},last:function(){return this.isValidPage(this.totalPages)?(this.setPage(this.totalPages),this):this},first:function(){return this.currentPage?this.setPage(1):this},toJSON:function(){var state={},keys=["itemsPerPage","currentPage","count"];return angular.forEach(keys,function(key){angular.isDefined(this[key])&&(state[key]=this[key])},this),state},defaults:{itemsPerPage:4,currentPage:1,totalItems:0}}),util.inherits(QuerySorting,EventEmitter,{directions:{ASC:"asc",DESC:"desc"},sort:function(name,direction){1===arguments.length&&(direction=this.directions.ASC);var sorting={name:name,direction:direction};return this.addSorting(sorting),this},hasSorting:function(sortingName){return this._sorting.some(function(sorting){return sorting.name===sortingName})},addSorting:function(sorting){return this.hasSorting(sorting.name)&&this._sorting.push(sorting),this},reset:function(){return this._sorting=[],this},toJSON:function(){return this._sorting.slice()}}),util.inherits(ContextEventEmitter,EventEmitter,{pause:function(){return this._pauseEvents=!0,this},resume:function(){return this._pauseEvents=!1,this.finish(),this},isPaused:function(){return this._pauseEvents},schedule:function(){var args=util.toArray(arguments);return this._queue.push(args),this},finish:function(){return this._queue.forEach(function(args,index){this.emit.apply(this,args)},this),this._queue.splice(0,this._queue.length),this},emit:function(){return this.isPaused()?this.schedule.apply(this,arguments):EventEmitter.prototype.emit.apply(this,arguments)}}),Context.createQuery=function(){return new ContextQueryBuilder},util.inherits(Context,ContextEventEmitter,{INVALID_RESPONSE:"INVALID_RESPONSE",getData:function(){return this.data},setData:function(dataTransferObject){if(util.isUndefined(dataTransferObject)||!util.isObject(dataTransferObject))return this.setError(this.INVALID_RESPONSE),this;var page=dataTransferObject.meta;if(page){var pagination=this.query.pagination();pagination.setState({totalItems:page.totalItems,currentPage:page.currentPage,itemsPerPage:page.itemsPerPage})}return this.data=dataTransferObject.data||null,this.error=null,this},createQuery:function(){return Context.createQuery().from(this.name)},pagination:function(){return this.query.pagination()},reset:function(){return this.query.reset(),this},update:function(){return this.triggerUpdate(this),this},triggerUpdate:function(){return this.emit("update")},setError:function(reason){},toJSON:function(){return this.query.toJSON()}}),util.inherits(ContextQueryBuilder,QueryBuilder,{}),util.inherits(DataProvider,EventEmitter,{find:util.missing("find"),findOne:util.missing("find")}),angular.module("repository",[]).value("Repository",Repository).value("DataProvider",DataProvider).value("RepositoryConfig",RepositoryConfig).value("QueryBuilder",QueryBuilder).value("QueryFilter",QueryFilter).value("QueryPagination",QueryPagination).value("QuerySorting",QuerySorting).value("Context",Context).value("ContextQueryBuilder",ContextQueryBuilder).value("ContextEventEmitter",ContextEventEmitter).value("util",util).value("EventEmitter",EventEmitter),window.EventEmitter=EventEmitter}();