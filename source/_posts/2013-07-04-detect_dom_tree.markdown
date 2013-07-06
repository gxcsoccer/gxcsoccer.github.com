---
layout: post
title: "监听DOM Tree"
date: 2013-07-04 00:33
comments: true
categories: DOM Mutation
---
最近一个项目中需要监听DOM tree的改变，首先想到使用[MutationObserver](https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver)。

{% jsfiddle 5s5gc js %}

不过发现在低版本的webkit里面并不支持该API。于是考虑使用Mutation events，查了一下资料虽然很多浏览器目前仍然支持Mutation events，但是在W3C的标准里它已被废弃，取而代之的就是之前提到的MutationObserver。关于Mutation events的问题，引用一段John Resig的描述：

> Yes, DOM mutation events already exist (in Firefox and Opera – fairly reliably – and dicey in Safari). They have a huge problem, though:
>     
> They absolutely cripple DOM performance on any page which they’re enabled.
>     
> Firefox, for example, when it realizes that a mutation event has been turned on, instantly goes into an incredibly-slow code path where it has to fire events at every single DOM modification. This means that doing something like .innerHTML = “foo” where it wipes out 1000 elements would fire, at least 1000 + 1 events (1000 removal events, 1 addition event).

总而言之，Mutation events会带来很大的性能问题，所以我们似乎也不应该使用它，那么还有什么其他方法吗？


###高效的山寨DOMNodeInserted事件
是的，还真有。我们可以利用CSS3的animationStart事件来模拟DOMNodeInserted事件。

具体方法是：  
1. 给指定的元素添加一个非常短暂的关键帧动画，比如叫：nodeInserted  
2. 监听animationStart事件  
3. 通过事件的animationName属性过滤，找到我们关心的元素  

{% jsfiddle KtZrh result,js,css,html %}

由于有动画的元素相对较少，所以该方法的性能比Mutation events会高出不少，并且在所有支持的CSS3 animation的浏览器上都支持，怎么样？很酷吧！