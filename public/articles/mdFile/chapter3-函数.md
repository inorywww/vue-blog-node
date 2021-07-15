# 函数

## 函数形参的默认值

### es6的默认参数值

```js
function fun1(url,timeout=2000){
    //...  该函数url为必需参数，timeout当没有参数传入或者传入为undefined时，默认就为2000
}
```

### 默认参数表达式

```js
function getVal(){
    return 5;
}
function fun1(first,second = getVal()){
    //... 该函数first为必需参数，second默认值为getVal()返回的值，5，不传入第二个参数才会调用getVal()
}
```

另外也可以

```js
function add(first, second = first){
    //... 当第二个参数没有传值时，默认值为第一个参数的值
}
```

## 处理无命名参数

### 不定参数

```js
//形参前面添加...就表示不定参数，该参数为一个数组，包含所有传入的参数，通过下标可以访问所有参数
function sum(val, ...vals){
   let vs = [];
   for(let i=0;i<vals.length;i++){
       vs.push(vals);
   }
}
//其中不定参数只能放在最后,下面这种就会报错。
function sum1(...vals,val){
    
}
```

## 展开运算符

展开运算符和不定参数相似，例如

```js
//es6之前的版本要使用Math.max()查找数组最大值。
const vals = [3,1,2];
console.log(Math.max.apply(Math,vals)) // 3
//es6之后可以直接使用展开运算符，会将数组分割为各自独立的参数
console.log(Math.max(...vals)) // 3 等价于 Math.max(3,1,2)

//另外可以将展开运算符和正常参数一起使用，例如限定返回值最小为0
const vals1 = [-10,-20,-30];
console.log(Math.max(...vals1, 0)) // 0
```

## name属性

es6中所有函数都增加了name属性，例如

```js
function fun1(){
    //...
}
const fun2 = function(){
    //...
}
const fun3 = function fun4(){
    //...
}
console.log(fun1.name)//fun1
console.log(fun2.name)//fun2
console.log(fun3.name)//fun4 由于函数表达式有一个名字fun4 权重比fun3高，所以为fun4
```

## 箭头函数

箭头函数有以下特性：

- 没有this super arguments new.target绑定，这些值由外层最近一个非箭头函数提供
- 不能用new关键字调用，因为箭头函数没有construct方法，不能用new构造
- 没有原型，因为不能用new，所有不存在prototype这个属性
- 不可以改变this的指向，
- 不支持arguments对象
- 不支持重复的命名参数

## 尾调用优化

指的是函数作为另一个函数的最后一条语句被调用，例如

```js
function fun1(){
    return fun2(); //尾调用优化
}
function fun1(){
    fun2() //无法优化 或者
    return 1+fun2()//无法优化
}
```

