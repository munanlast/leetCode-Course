const path = require('path');
function parsePath(path){
  console.log(path);
  return path;
}
module.exports = {
  entry: './main.js',
  target: 'node',
  output: {
    path: __dirname,
    filename: 'out.js'
  },
  resolve: {
    alias: {
      'vs': parsePath(path.resolve('vscode')),//
      './vs': parsePath(path.resolve('vscode'))
    }
  },
  mode: 'production',
  node: {
    __filename: false,
    __dirname: false
  }
};