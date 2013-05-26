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
* relative 相对定位
* static 正常文本流
* fixed 固定定位


###float
通过该属性可以设置节点的浮动方式，可选的值有：  

* none 不浮动
* left 向右浮动
* right 向右浮动

###display
display属性指定了浏览器通过什么样的“盒子”来渲染当前节点。display可选的值有很多，主要可以分为下面几类，本文主要讨论前面两类常用的。

####基本值

* none
* inline
* block

####CSS 2.1扩展值

* inline-block

####表格

####Flex Box

####Grid Box


<!--more-->

##组合

<未完待续>