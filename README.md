XO
==

A lightweight webapp framework developed by [TENCENT ECC_UX_OS Team](http://ecd.tencent.com)

Basic architecture
===

    |-- hashchange
    |    |-- Backbone.history
    |    |
    |---Router （路由器）
    |    |-- Backbone.Router -- | ox.router
    |    |
    |--- Controller （控制器）
    |    |-- ox.controller
    |    |
    |--- View （视图）
    |    |-- ox.view
    |    |

Router
===

路由器扩展自Backbone.Router。

根据hash，解析出当前url所要渲染的页面，还有该页面拉数据用到的一些查询参数（Querystring），接着调用控制器的方法。

Controller
===

控制器拿到路由器给过来的参数，选取合适的视图，拉取服务器端数据。然后调用视图的render方法进行渲染。

View
===

视图扩展自Backbone.View。

视图的作用：

1. 获取视图的HTML模板（从页面中获取、localStorage获取，或者从远程服务器获取）
2. 提供dom的事件绑定
3. 提供一个渲染方法render
4. 提供一个动画方法animate。该方法调用ox.animate库进行动画效果

视图根据类型可以大概分为以下几种：

1. Page (页面)，对应article标签
2. Section (段落)，对应section标签
3. Aside (边栏)，对应aside标签
4. Popup (弹出浮层)
5. 其他自定义视图

Page和Section是包含与被包含的关系，一个Page内可以有多个Section切换。
Page和Aside的关系同上。
Popup是独立的视图，和Page同级。

一个Webapp可能只有一个Page,然后切换Section和Aside，也可以有多个Page。


Animate
===
预定义了一系列的动画切换效果。