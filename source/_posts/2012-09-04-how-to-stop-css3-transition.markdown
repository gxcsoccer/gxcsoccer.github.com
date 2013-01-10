---
layout: post
title: "如何停掉CSS3动画？"
date: 2012-09-04 00:07
comments: true
categories: css3
---
CSS3里面提供原生的动画（Animation）和过渡（Transition）支持，使用起来非常简单方便，但是一直有一个问题困扰着我：如何实现像JQuery动画提供stop方法一样的功能？

今天在学习bootstrap代码的时候发现一段有意思的代码。这段代码意图非常简单，就是要显示$element元素，并且给它加上"in"类，使其产生slide in的效果。但让我看不懂的是：`that.$element[0].offsetWidth`这句代码，好像没有做什么实质性的事情，后面的注释写的是force reflow（强制重绘）。
{% gist 3611790 %}

在网上查找了相关的资料，看到[Stackoverflow](http://stackoverflow.com/questions/9016307/force-reflow-in-css-transitions-in-bootstrap)上有人做了解答：
>That's where the call to the left offset comes in. This is one of the properties that are said to cause a re-flow in the page. This is obviously usually a bad thing performance wise, but it seems necessary to prevent the css transitions picking up the wrong values.

大概的意思是：读取offsetWidth(或者left offset)导致了浏览器的`re-flow`操作，这样做的目的有点类似我们在使用buffer时候的flush操作，虽然会带来性能问题，但是在特定场景下可以防止css3 tranisition取到错误的值。

<!--more-->
###如何利用force reflow停掉进行中的css3动画？

请看下面的例子（[在firefox下有问题](https://bugzilla.mozilla.org/show_bug.cgi?id=649247)，请用webkit浏览器）。点击背景，红色的方块会朝右移动到600px的位置，在中途如果再次点击桌面，方块会停止动画，直接跳到目标位置（600px）

{% jsfiddle Y8PRF result,js,html,css %}

那么如果我们对代码稍做修改，注释掉`$box[0].scrollLeft;`这行，再运行，发现第二次点击背景时动画无法停掉。

###什么情况下会触发浏览器的reflow?
* DOM元素的添加、修改（内容）、删除( Reflow + Repaint)
* 仅修改DOM元素的字体颜色（只有Repaint，因为不需要调整布局）
* 应用新的样式或者修改任何影响元素外观的属性
* Resize浏览器窗口、滚动页面
* 读取元素的某些属性（offsetLeft、offsetTop、offsetHeight、offsetWidth、 scrollTop/Left/Width/Height、clientTop/Left/Width/Height、 getComputedStyle()、currentStyle(in IE))

###避免滥用force reflow
浏览器频繁的repaint/reflow会带来严重的性能问题，所以非必须的情况下应该尽量避免触发reflow。下面是常用优化方法：

* 避免在document上直接进行频繁的DOM操作，如果确实需要可以采用off-document的方式进行
* 集中修改样式
* 缓存Layout属性值
* 设置元素的position为absolute或fixed
* 权衡速度的平滑
* 不要用tables布局
* 不要在css里面写expression

具体描述可以参考：<http://www.blueidea.com/tech/web/2011/8365.asp>







