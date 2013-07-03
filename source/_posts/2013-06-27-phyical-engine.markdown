---
layout: post
title: "HTML5物理引擎--Verlet.js"
date: 2013-06-27 22:37
comments: true
categories: Phyical System,Verlet.js
---
首先，让我们来看一个HTML5模拟的衣服效果:

{% jsfiddle sRR4z result,js,html %}

很酷吧，要实现这样的效果想必很难吧？的确，如果没有框架的支持我们需要了解一些数学和运动学的基本知识。不过，下面我要隆重推出本文主角——

##[Verlet](https://github.com/subprotocol/verlet-js)
它是一个开源的js物理引擎，相比于其他同类引擎，它有下面优势

* 非常轻量级，未压缩的也不过不到700行
* 相比其体积，它提供了强大的功能和良好的扩展性
* 易用的API，类库内置了4种物理元素：点、线段、衣服（cloth）、多变型（tire）

{% jsfiddle aJPVz result,js,html %}

(未完待续)

