---
layout: post
title: "闭包总结"
date: 2013-05-20 04:58
comments: true
categories: 
---
##什么是“闭包”?
通俗讲闭包就是--定义在函数内部的函数可以访问外层作用域的变量。当然这只是闭包的表象，要理解闭包我们先要澄清两个容易混淆的概念。

##执行环境（Execute Context）
当进入（开始执行）一段可执行代码时，便生成一个执行环境对象。

一个执行环境（Execute Context）包含三个要素：

* 词法环境 – LexicalEnvironment
* 变量环境 – VariableEnvironment
* This绑定 - ThisBinding

注：词法环境在我理解就是所谓的“作用域”。

##作用域（Scope）
JavaScript只有两种作用域（没有块级作用域）

* 全局作用域：即全局可以访问的作用域，包括下面一些    
  	1. 最外层定义的变量和函数
  	2. 未定义直接赋值的变量
  	3. Global对象的属性


* 局部作用域：只有固定代码片段可以访问，创建局部作用域（词法环境）的方式有
	1. 执行函数
	2. 执行Catch语句
	3. with
	
<!--more-->

##作用域链（Scope Chain）
在JavaScript中，函数有一个内部属性[[Scope]]，由ECMA-262标准第三版定义，该内部属性包含了函数被创建的作用域中对象的集合，这个集合被称为函数的作用域链，它决定了哪些数据能被函数访问。

{% codeblock lang:javascript %}
function foo() {
	var bar = 3;
	return bar;
}

foo();
{% endcodeblock %}
例如上面函数foo是在全局作用域上创建的，所以全局对象就填充到其作用域链上了。在执行foo函数的时候，会创建一个新的执行环境（Execute Context）包括一个新的词法环境（作用域），并将其推到作用域链的前端。

__现在回过来想想为什么JavaScript语言会有闭包就很容易理解了。因为ECMAScript中变量解析是一个自内向外查找过程，而非绑定过程。__

##闭包的实践
###循环异步调用的问题
闭包的一个典型的应用就是循环绑定事件。
{% codeblock lang:javascript %}
for(var i = 0; i < 10; i++) {
	document.getElementById('box' + i).onclick = function() {
		alert('You clicked on box #' + i);
	}
}
{% endcodeblock %}
上面的代码存在著名的"last value"问题，最终结果是点击任何一个box都提示点击的是9号。解决的方案有很多种，其中一种就是利用闭包
{% codeblock lang:javascript %}
for(var i = 0; i < 10; i++) {
	document.getElementById('box' + i).onclick = (function(index) {
		return function() {
			alert('You clicked on box #' + index);
		}
	})(i);
}
{% endcodeblock %}
###私有变量和方法
上一篇文章提到过用闭包模拟OOP中的私有变量和方法

###函数的绑定和柯立化
在ES 5里面函数提供了一个新的方法bind，它可以指定函数执行环境所绑定的this对象，实际上这个方法也是闭包的完美应用
{% codeblock lang:javascript %}
var slice = Array.prototype.slice;
Function.prototype.bind = function(thisArg) {
	var fn = this,
		args = slice.call(arguments, 1);
	return function() {
		return fn.apply(thisArg, args.concat(slice.call(arguments, 0)));
	};
};
{% endcodeblock %}
<未完待续>