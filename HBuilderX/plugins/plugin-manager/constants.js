const path = require('path');
//可以利用node的缓存机制，将需要的变量全部初始化到这里
let pluginsDir = path.dirname(__dirname);
let constants = {
    pluginsDir:pluginsDir,
	get inWebpackEnvironment(){
		return (typeof __webpack_require__ === 'function');
	}
}
module.exports = constants