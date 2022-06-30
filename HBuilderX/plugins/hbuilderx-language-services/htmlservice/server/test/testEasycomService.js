const easycomService = require("../out/vue/easycomService");


let easycoms = easycomService.collectEasycoms({
	name:"HelloUniapp2",
	uri:"file:///Users/wangkunpeng/Documents/HBuilderProjects/HelloUniapp2"
});

if(easycoms){
	easycoms.forEach(com=>{
		console.log(com.name + "=>" + com.filePath);
	})
}