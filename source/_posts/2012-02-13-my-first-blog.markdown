---
layout: post
title: "开始用octopress写博客"
date: 2012-02-13 00:55
comments: true
categories: octopress 
---
##注册和配置Git
开始之前，确保你已经有了[Github](http://github.com)账号一枚和Git的正确配置。没有的朋友可以先移步[Github](http://github.com)注册并[安装配置Git](http://help.github.com/win-set-up-git/)

首先，创建你的blog仓库：“username(请确保和你的帐号相同).github.com”
    $ mkdir username.github.com
    $ cd username.github.com

在仓库下新建一个HTML文件
{% codeblock index.html lang:html %}
<html>
    <head>
        <title>Hello World</title>
    <head>
    <body>
        <h1>Hello World!</h1>
    </body>
</html>
{% endcodeblock %}

初始化仓库、提交并push到Github:

    $ git init
    $ git add .
    $ git commit -a -m 'init commit.'
    $ git remote add origin
    $ git push origin master

ok了，用username.github.com就可以访问上面的页面

<!--more-->

##安装Octopress
[Octopress](http://octopress.org/)是一个基于ruby的静态博客管理工具。具体安装过程可以参考[官方网站](http://octopress.org/docs/setup/)，这里就不赘述了

这里只讲一些要点：  

* 需要在定制文件： `_config.yml` 中把twitter中的信息全部删掉，否则由于防火长城GFW的原因，将会造成页面load很慢。
* 需要在定制文件/source/_includes/custom/head.html 把google的自定义字体去掉，否则方滨兴老师会让你的网站时不时卡一下。
* 发布文章用`rake new_post["title"]`
* 文章使用markdown语言进行编写，相关的语法可以参考[这里](http://daringfireball.net/projects/markdown/syntax)
* 文章写好以后用`rake generate`生成静态HTML页面，建议用`rake preview`在本地预览以下<http://localhost:4000>
* 没有问题后调用`rake deploy`部署。


##Q&A
###解决rake generate命令invalid byte错误的方法
![Invalid Byte](/images/post/invalid_byte.png "Invalid Byte")
    $ export LC_CTYPE=en_US.UTF-8
    $ export LANG=en_US.UTF-8

##参考文档
* <http://octopress.org/docs/>
* <http://tangqiaoboy.blog.163.com/blog/static/1161142582011112510244675/>
* <http://daringfireball.net/projects/markdown/syntax>
* <http://taberh.me/2011/12/26/use-Jekyll-build-Blog-on-Github.html>
