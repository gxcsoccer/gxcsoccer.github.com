---
layout: post
title: "坑爹的排序"
date: 2013-07-13 22:37
comments: true
categories: JavaScript
---
##Chrome的bug?
在JavaScript里排序，我们一般都会用Array类的sort方法，例如：  
{% codeblock lang:js %}
// 将数组降序排序
[4, 2, 1, 4, 3].sort(function(a, b) { return a < b; });
// [4, 4, 3, 2, 1]
{% endcodeblock %}

没问题，那我们再看一个例子：  
{% codeblock lang:js %}
// 将数组降序排序
[5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5]
	.sort(function(a, b) { return a < b; });
// chrome [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
{% endcodeblock %}

Firefox和IE下结果正确，但是在chrome下结果大跌眼镜，4跑到最前面去了，这难道是chrome的bug吗？

##V8排序的算法
于是我翻出[V8引擎对数组排序实现的代码](http://v8.googlecode.com/svn/trunk/src/array.js)，研究了一番

<!--more-->

{% codeblock lang:js %}
function ArraySort(comparefn) {
  // …

  var InsertionSort = function InsertionSort(a, from, to) {
      for (var i = from + 1; i < to; i++) {
        var element = a[i];
        for (var j = i - 1; j >= from; j--) {
          var tmp = a[j];
          var order = % _CallFunction(receiver, tmp, element, comparefn);
          if (order > 0) {
            a[j + 1] = tmp;
          } else {
            break;
          }
        }
        a[j + 1] = element;
      }
    };

  // …
  
  var QuickSort = function QuickSort(a, from, to) {
      var third_index = 0;
      while (true) {
        // Insertion sort is faster for short arrays.
        if (to - from <= 10) {
          InsertionSort(a, from, to);
          return;
        }
        if (to - from > 1000) {
          third_index = GetThirdIndex(a, from, to);
        } else {
          third_index = from + ((to - from) >> 1);
        }
        // Find a pivot as the median of first, last and middle element.
        var v0 = a[from];
        var v1 = a[to - 1];
        var v2 = a[third_index];
        var c01 = % _CallFunction(receiver, v0, v1, comparefn);
        if (c01 > 0) {
          // v1 < v0, so swap them.
          var tmp = v0;
          v0 = v1;
          v1 = tmp;
        } // v0 <= v1.
        var c02 = % _CallFunction(receiver, v0, v2, comparefn);
        if (c02 >= 0) {
          // v2 <= v0 <= v1.
          var tmp = v0;
          v0 = v2;
          v2 = v1;
          v1 = tmp;
        } else {
          // v0 <= v1 && v0 < v2
          var c12 = % _CallFunction(receiver, v1, v2, comparefn);
          if (c12 > 0) {
            // v0 <= v2 < v1
            var tmp = v1;
            v1 = v2;
            v2 = tmp;
          }
        }
        // v0 <= v1 <= v2
        a[from] = v0;
        a[to - 1] = v2;
        var pivot = v1;
        var low_end = from + 1; // Upper bound of elements lower than pivot.
        var high_start = to - 1; // Lower bound of elements greater than pivot.
        a[third_index] = a[low_end];
        a[low_end] = pivot;

        // …
        
        if (to - high_start < low_end - from) {
          QuickSort(a, high_start, to);
          to = low_end;
        } else {
          QuickSort(a, from, low_end);
          from = high_start;
        }
      }
    };
  // …

  QuickSort(this, 0, num_non_undefined);
  // …
  
  return this;
}
{% endcodeblock %}

V8的实现是当数组长度小于10的时候采用插入排序，否则使用快速排序。我们刚才的第二个例子的数组长度为12，所以应该走快速排序的逻辑，而大家知道快速排序算法的思想就是找到一个轴，将大于和小于它的数据分居在轴两侧，然后递归这一动作直到结束。

那么我们可以用例子二的数据模拟下V8算法的流程：  

1. 首先找到v0，v1，v2三个位置（头，尾，正中间）
2. 用comparefn判断v0（头）和v1（尾）两个位置的数据是否应该交换，我们传入的comparefn是返回`a < b`，那么`5 < 5`应该返回false（即c01），而上面代码的第40行`if (c01 > 0)`的判断语句应该为false，所以无需交换头尾位置；
3. 再用comparefn判断v0（头）和v2（正中）两个位置是否应该交换，那么`5 < 4`返回false（即c02），那么根据47行的条件判断`if (c02 >= 0)`（c02隐式转换为0，所以0 >= 0为真），应该交换v0和v2，到这里我们已经可以看出为什么降序排序最小的4反而跑到最前面去了。（后面的流程略过）

那么这是v8或者chrome的bug吗？我google了下，确实不少人提到了这个[issue](http://code.google.com/p/v8/issues/detail?id=103)。根据上面的回复以及[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)上对于compareFn的定义，严格来说v8实现的没有问题，问题在于我的comparefn返回的是一个布尔值（true or false），而ECMAScript里期待comparefn返回的是-1，0和1三种数值，这里true转换成了1，false转换成了0，而对于0这个值的处理ECMAScript里没有做明确的规定，所以导致各个浏览器实现的不一致。

那么我们把comparefn替换成标准的返回-1，0和1的函数，再看看结果

{% codeblock lang:js %}
// 将数组降序排序
[5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5]
	.sort(function(a, b) { return a === b ? 0 : a < b ? 1 : -1; });
// [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5， 4]
{% endcodeblock %}

OK，完全正确，所以说在写comparefn时一定要对三种情况分别返回-1，0和1，否则就会出现上面例子2的莫名其妙的问题。