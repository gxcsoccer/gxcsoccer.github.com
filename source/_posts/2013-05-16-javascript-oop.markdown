---
layout: post
title: "OPP in JavaScript"
date: 2013-05-16 03:32
comments: true
categories: JavaScript, OOP
---
> 面向对象的设计思想是语言无关的。但是在实现上JavaScript和其他语言还是有些区别的。

##对象的构造：
* __字面量__  可以用JSON风格直接构造一个对象，这是一种非常直接和简洁的对象创建方式。 

```
var obj = {
	name: "Peter Gao",
	age: 29
};

obj.sex = "male";
delete obj.age;
``` 

* __构造函数__  和其他面向对象语言类似，我们可以使用new关键字加构造函数的方式来创建一个对象，在`new A`的时候JavaScript引擎做了下面几件事情：
	1. 	创建一个新的对象
	2. 	将对象的contructor属性设置为A
	3. 	将A.prototype设置为新对象的原型
	4.	以新对象为上下文(context)执行A

* __Object.create__  这是ECMAScript 5里面提供的一个新方法，通过这个方法我们可以直接指定对象的原型。甚至通过`Object.create(null)`我们可以创建一个没有原型的“干净”对象

##面向对象的三大特性：
* __封装__  和其他语言不同的是，JavaScript里对象没有私有属性的概念，很多时候我们约定以下划线开头的属性为私有的，但这只是一个“君子协议”。如果实在要模拟私有属性，我们可以通过function来构造一个沙箱，沙箱里的局部变量是私有的，外部不能访问，通过function的返回值来暴露接口给外面调用

```
function getObject() {
	var privateProp = "p"; // 局部变量，外层无法访问
	
	return {
		getProp: function() {
			return privateProp;
		},
		setProp: function(val) {
			privateProp = val;
		}
	};
}

```

* __继承__  JavaScript的原生语法是不支持继承的，但是其原型链的设计可以很好的支持继承。具体的实现方法有很多种，在这儿不一一列举了。

```
var Monster = function(life) {
	this.life = life;
}

Monster.prototype.eat = function() {
	this.life += 5;
};

var Dragon = function() {
	Monster.call(this, 100);
};

Dragon.prototype.__proto__ = Monster.prototype;

Dragon.prototype.fight = function() {
	this.life -= 10;
};
```

* __多态__
这个没什么好说的，对象可以覆盖父类的属性和方法，因为JavaScript是顺着原型链往上查找属性和方法，直到找到为止。

##鸭子类型

作为一门动态语言，对象类型除了可以通过原型链来描述，还可以通过一个简单的对象来表示，即所谓的“鸭子类型”————只要看起来像鸭子，就是鸭子。这种方式可以避免构造过于复杂的原型链。我们可以将常用的功能定义为mixin，需要的话直接拿来用即可。


##几个重要的属性：
* __obj.constructor__: 指向对象的构造函数，这个属性可以被修改，但是不能通过修改该属性真正改变原型链

```
var Cat = function() {}
var Dog = function() {}
var c = new Cat;
c.constructor = Dog;

c.constructor === Dog 	// true
c instanceof Dog 		// false
c instanceof Cat		// true
```

* __constructor.prototype__: JavaScript里function本身也是一种特殊的对象，它包含一个属性prototype指向另一个对象，用该函数作为构造函数生成的对象就以prototype指向的对象作为原型

* __obj.\_\_proto\_\___: 在标准浏览器上对象有一个\_\_proto\_\_属性指向对象的原型，其等价于`obj.constructor.prototype`（如果`obj.constructor`没有被篡改）
