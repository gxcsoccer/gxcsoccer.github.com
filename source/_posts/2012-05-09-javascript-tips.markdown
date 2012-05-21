---
layout: post
title: "JavaScript奇技淫巧（持续更新）"
date: 2012-05-09 02:21
comments: true
categories: JavaScript
---
JavaScript是一门很“飘逸”的语言，网上很多朋友总结了其中不少奇技淫巧。其实，这些技巧并不都推荐使用，但是了解其背后的原理能帮助你更上一层楼。在此收集了其中一些附在下面：

##把数值类型装换为字符串
###转型： 1 + ''

>这个比较简单，加法运算符接收两个参数中，任意一个是字符串，会将另位一个转换为字符串，然后拼接起来。

##把字符串转换为数值类型
###转型：+'1'

>我们知道`-`作为减法运算符时接收两个参数，而作为求负运算符时，接收一个参数。JavaScript 支持另一个不多见的“求正”的`+`运算符。显然，`+`会尝试把任何接收到的参数转换为数值型。如此，我们就有了一个廉价转型方法，考虑一下：`parseInt('123')`vs`+'123'`.

###举一反三
* `'1' * 1`乘法运算符接收数值型参数，字符串会先转换成数字再和1做计算
* `'1' / 1`同上
* `'1' - 0`同上
* `'1' + 0`注意是不行的，它得到的值是：`'10'`。因为加法运算符两个参数中如果有一个为字符串，会将另外一个转换为字符串，然后将两个字符串拼接起来

###转型并取整：'123.4' | 0

>这里使用“或运算”将左边得字符串隐式转换为数值型，再与`0`或。所有位运算逗要求使用**32**位整数参与运算。所以这又式一个廉价得转换取整方法。考虑一下：`Math.floor('1234.5')`vs`'1234.5' | 0`

>但是，**32**位整数表示的数据范围是有限的，因此这一招在数值超过2^31 - 1时不适用，考虑一下`'12345678912.3' ^ 0`

###举一反三

* `'1234.5' ^ 0`完成转型并取整，与`0`异或，得到它本身。
* `~~'1234.5'`同样可以完成转型并取整，两次取反后得到本身。
* `--'1234.5'`会失败。虽然我们说负负得正，但是在C语系中，`--`运算符优先级高于单个`-`。解决办法很简单，把`--`写成`- -`就好啦，赠加一个空格避免运算符被错误地识别。同理，`++`也要这么处理。

<!--more-->

##数组操作
>arguments是一个“著名”的类数组对象。在看JQuery代码的时候发现，只要一个Object实现了splice方法和length属性，在浏览器中就会被认为是一个数组

{% jsfiddle LbyMF js default %}

###遍历数组

{% jsfiddle tazSk js default %}
>淫巧1有一个问题：当数组元素是null，undefined，0，false等时会造成循环终止。

>淫巧2说明数组也是一个普通的Object，索引0,1,2…是数组的属性，需要注意的是在Javascript里面纯数字是不能作为变量和属性名字的，作为Object的属性时，它们实际上是string类型的，鲜为人知的是用中括号[]存取时，JS引擎内部隐式的将数字转成了字符串。

##懒人的闭包
闭包即`function() {}`代码块。通常需要控制JavaScript变量作用域时，我们把代码放在这个块中运行：

{% codeblock lang:javascript %}
(function() {
    var foo = 1, bar = 2;
    sth(foo, bar);
})();
{% endcodeblock %}

###失败的闭包
上面的代码中要写两对括号，如果代码块太长的话，上下的括号不方便对照。于是，你可能会有意无意漏掉`function`周围的括号:

{% codeblock lang:javascript %}
function() {
    var foo = 1, bar = 2;
    sth(foo, bar);
}();
{% endcodeblock %}

很不幸，运行这段代码会报语法错误（不同 JavaScript 执行程序抛出的异常信息可能会不一样）：

`Exception: SyntaxError: Unexpected token '('`

>背景知识：**`()`只能用来求值、定义参数列表或调用函数表达式（*expression*）**。本来，`function() {}`定义的一个函数字面量（如同数组字面量 []）表达式是可以拿来调用的，但是由于设计上的原因，`function`有两种表达形式：`function fn() {};`: 这是函数声明（*declaration*）的语句（statement）；`var foo = function() {}`: 这是函数字面量（*literal*）表达式。与上面雷同的写法`var foo = function fn() {}`也是合法的表达式，不过有一点小[区别](http://ejohn.org/apps/learn/#11)。

即是说，**JavaScript 需要有足够的上下文（*context*）才能判断 function 的使用属于语句还是表达式。**
S
对于单独（在语句前后加上分号将其表达为独立语句）的`;function() {}();`来说，JavaScript无法区分其中的`function`是表达式还是语句。此时，JavaScript选择了传统的语句识别，于是它被识别为两个语句————两个有问题的语句：前者缺少函数名称声明，后者不允许使用空的`()`进行求值。

于是懒人们行动了，网上流传了一些不写第一组括号也能正确运行的闭包。

###懒人的解决方案

这是比较常见的懒人闭包：

{% codeblock lang:javascript %}
+function() {
    var foo = 1, bar = 2;
    sth(foo, bar);
}();
{% endcodeblock %}

为什么它能执行？因为它很好地“营造”了一个让JavaScript将其中的 `function`识别为表达式的环境————通过单目求正运算符，让 JavaScript知道这里的`function`不可能是语句。哪有对语句进行运算的啊。

###举一反三

既然写个`+`运算符就行，那就好玩了：

* `-function() { return -1; }()`求负也行哈。PS: 如果你运行这个语句，会得到 1, 因为函数返回的 -1 被你求负了一次。
* `!function() { return -1; }()`取非也没问题。提问：运行它会返回什么？
* `1 + function() { return -1; }()`非常标准的表达式，当然 OK 啦…
* `void function() { return -1; }()`亲，`void`也是运算符哦，`delete`能用吗？当然可以！
* `1, function() { return -1; }()`别把逗号不当运算符！
* `~function() { return -1; }()`位运算符也来凑热闹了哈…
* 还可以写很多，随便怎么玩，只要组成表达式就行，自由发挥吧…

##String.replace的妙用
>JavaScript的`String.replace`方法应该大家都了解，可是你掌握了吗？`replace`有接受两个参数，第一个参数可以是字符串，也可以是正则表达式，第二个参数除支持字符串之外，还支持$1形式正则匹配的文本，除此之外还支持传入一个处理函数，这个函数的return值就是要替换成的内容。

>了解更多javascript的String.replace用法，访问：<http://www.w3school.com.cn/js/jsref_replace.asp>

在实际开发中，我们会遇到对于一些集合做重复性的操作。假如，我们要获取div1, div2, div3…的长和宽。最笨的办法就是先取div1的，再取div2的，以此类推。这样重复代码多，而且不“优雅”。当然你也可以将重复代码提取为一个函数，但是这个函数可能就这个地方用的到，没有通用性，比较浪费。

那么自然大家想到了使用循环，将div1, div2, div3…放到数组里面，然后循环数组
{% codeblock lang:javascript %}
var arr = [];
arr.push('div1', 'div2', 'div3');

arr.forEach(function(a, i){
	console.log(a);
	// do something
});
{% endcodeblock %}

当然还可以这样：
{% codeblock lang:javascript %}
'div1 div2 div3'.split(' ').forEach(function(a, i){
	console.log(a);
	// do something
});
{% endcodeblock %}

这样对于支持forEach的高级浏览器还是可以的，否则需要扩展数组原型了，不提倡扩展原型，即使不扩展原型提供个额外的函数来操作，就又是浪费。

如果使用了JQuery或者underscore，还可以用它提供的each方法：
{% codeblock lang:javascript %}
$.each('div1 div2 div3'.split(' '), (function(i, a){
	console.log(a);
	// do something
}));
{% endcodeblock %}

但是，其实我们用replace就可以实现类似的功能：
{% codeblock lang:javascript %}
var wh = {};
"div1 div2 div3".replace(/[^ ]+/g,function(a){
	var elem = document.getElementById(a);
        wh[a] = {};
	'Width Height'.replace(/[^ ]+/g, function(i){
			wh[a][i] = elem['offset' + i] || elem['client' + i];
		});
});
console.log(wh);
{% endcodeblock %}

##位运算判断元算是否在集合中
{% codeblock lang:javascript %}
if(~'abc'.indexOf('b')) {
	// do something
}

// 等价于

if('abc'.indexOf(b) !== -1) {
	// do something
}
{% endcodeblock %}

>背景知识：`补码`：任何数值n的位反等于-(n + 1):
~n === -(n + 1)。很明显，只有~-1才等于0。

>String的`indexOf`方法，找到时，返回自然数；没找到，则返回-1。

其实两种写法的差别不大，用位运算更简洁一些，但随之而且也可能造成代码比较晦涩
