let constructors = {}
// 用于更严谨的判断对象类型为object，例如null也是object的一种
function getType(val) {
	return Object.prototype.toString.call(val).slice(8,-1).toLowerCase()
}
module.exports = {
	newObject:function(obj,deep){
		
			if(getType(obj) !== 'object'){
				return obj;
			}
			//复制一份对象
			// var newObj = JSON.parse(JSON.stringify(obj));
			var newObj = obj;
			
			
			// 先遍历子对象是否有需要创建的本地对象
			for(let prop in newObj){
				if(typeof newObj[prop] === 'object'){
					var newo = this.newObject(newObj[prop],deep);					
					newObj[prop] = newo;
				}
			}
			
			if(newObj.metatype){
				if(newObj.metatype in constructors){
					newObj = new constructors[newObj.metatype](newObj);
				}
			}
				
			return newObj;
		// }
	},
	registerObject:function(metatype,constructor){
		constructors[metatype] = constructor;
		constructor.prototype.metatype = metatype;
	}
}