console.log('测试js打包');

function add(x, y) {
  return x + y;
}

console.log(add(3, 5));

const s = () => {
  console.log('es6语法箭头函数');
};
s();

new Promise(((resolve, reject) => {
  resolve('aa');
})).then((r) => {
  console.log('测试promise的使用');
});
