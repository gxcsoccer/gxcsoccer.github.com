---
layout: post
title: "浅谈display, position, float"
date: 2013-05-26 07:18
comments: true
categories: 
---
display, position, float三者可以说是CSS布局里最基本也最常用的属性。在此对这三个属性的可选值以及互相叠加的效果做一个总结。

##基本概念
###position
通过该属性可以设置节点的定位方式，可选的值有：  

* absolute 绝对定位  
从文本流中抽离出来，单独生成一个“块级”盒子。该盒子的位置将相对于“显示定位”的父节点左上角来定位，如果没有“显示定位”的父节点就以body元素左上角为原点。

* relative 相对定位  
相对定位是以元素“原来”位置的基础上来定位。元素在文本流中的原始位置会保留，不会被其他元素占据

* static 正常文本流  
默认值，不定位

* fixed 固定定位  
相对于浏览器的“视口”进行定位，视口大小不受文本流大小影响。

<!--more-->

###float
浮动和绝对定位类似，被浮动的元素也会从文本流中抽离，不同的是它会曹着指定方向浮动直到碰到容器的边界或者另外一个浮动的元素，就好像顺着水流浮动的木箱子。可选的值有：  

* none 不浮动，默认值
* left 向左浮动  
* right 向右浮动

{% jsfiddle rQutX result,css,html %}

###display
display属性决定了浏览器用什么样的“盒子”来渲染当前节点。display可选的值有很多，主要可以分为下面几类，本文主要讨论常用的4种取值。

####基本常用的值

* __none__ 从DOM树上上移除该节点（包括其子节点），不会产生任何的“盒子”
* __inline__ 这是display的默认值，行内元素不会“打断”正常的文本流，它会顺着文本流的方向横向的排列。  
注：行内元素的width和height属性是不起作用的，margin和padding也只在水平方向排挤其他元素。
{% jsfiddle qPeZR result,css,html %}

* __block__ 和行内盒子不同的是，块级的盒子是垂直方向排列的，它会截断前后的文本流另起一行显示，如果不设置宽度则会尽可能占满正行。

{% jsfiddle QEr8W result,css,html %}
* __inline-block__ 结合了inline和block的特点，顺着文本流的方式水平排列，但是可以设置高度、宽度、margin和padding等。

{% jsfiddle spsbj result,css,html %}


####和表格相关的值
包括了table, table-cell, table-column, table-colgroup, table-header-group等等，它们都强制元素以表格的方式呈现，这里不详细讲了

####Flex Box
具体参考[这里](http://css-tricks.com/snippets/css/a-guide-to-flexbox/)

####Grid Box
只有IE10支持，具体可以参考[这里](http://dev.w3.org/csswg/css3-grid-layout/)。

##三种属性相互叠加的效果
1. 绝对定位和fixed定位会强制生成块级元素，display的computed值为block
2. 浮动也会导致display值变为block，除了少数不支持浮动的display值(如：flex)
3. 绝对定位和浮动放在一起，浮动无效
4. fixed定位和浮动放在一起，浮动无效

