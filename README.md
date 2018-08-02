简墨CMS - 简明开发手册
==============================
版本: 1.2.1

# 一、模板开发

## 1.1 开始前准备

在开始开发模板前，你应该能够熟练使用 `HTML`、`JavaScript` 和 `CSS` 编写网页程序；你还需要了解 `JSON` 数据格式。

简墨CMS采用简墨引擎开发（简墨引擎: 100%前后端分离的应用开发框架+后端服务平台)； 你需要了解`简墨页面`构建原理和基础操作。 `简墨页面` 由 JavaScript (ES6)、 HTML、JSON 和 LESS(CSS) 组成。HTML负责组件布局，LESS负责样式定义，JavaScript负责逻辑处理、JSON负责数据源定义，如果你熟悉VUE或者微信小程序开发，花费几分钟即可上手。开发简墨页面，需要在线调试；所以在开始开发前，先要安装简墨引擎和简墨CMS应用。[开发简墨页面](http://book.tuanduimao.com/357326) 

**简墨页面 `hello` 示例：**

|文件名| 简介 | 类型 |
| --- | --- | --- |
| hello.page | 页面布局  | HTML |
| hello.less | 页面样式 | LESS  |
| hello.js   | 页面逻辑 | JavaScript  |
| hello.json | 数据源和页面配置 | JSON  |


**安装配置文档：**

[简墨引擎安装手册]() 
[简墨CMS安装手册]() 
[简墨CMS一键安装]() (腾讯云镜像)
[简墨CMS安装器下载]()

## 1.2 WEB 模板

当用户通过电脑浏览器访问时，路由程序将请求转交给这部分简墨页面进行处理。源码参见: `/ui/web` 

### 1.2.1 简墨页面清单

**页面清单**

| 简墨页面 | 页面名称 | 页面路由 | 路由参数 | 兼容页面 | 页面简介 |
| --- | --- |  --- | --- | --- | --- |
| /desktop/article/index | 首页 | `/` <br/> `/index.html` <br/> `/article.html`  | |手机浏览器: `/mobile/article/index` <br/> 微信浏览器: `/mobile/article/index` <br/> 微信小程序: `/article` | 网站首页 |
| /desktop/article/list | 图文栏目列表页  | `/article/list/{cid:.+}.html`  | 栏目ID| 手机浏览器: `/mobile/article/list` <br/> 微信浏览器: `/mobile/article/list` <br/> 微信小程序: `/article/list` | 栏目列表页 |
| /desktop/article/recommend | 图文推荐列表页  | `/article/recommend/{rid:.+}.html` | 推荐别名  |手机浏览器: `/mobile/article/recommend` <br/> 微信浏览器: `/mobile/article/recommend` <br/> 微信小程序: `/article/recommend` | 图文推荐列表页 |
| /desktop/article/detail | 图文详情页 | `/article/{id:[0-9a-zA-Z]+}.html`  | 文章ID  |手机浏览器: `/mobile/article/detail` <br/> 微信浏览器: `/mobile/article/detail` <br/> 微信小程序: `/article/detail` | 图文详情页 |
| /desktop/album/list | 图集栏目列表页  | `/album/list/{cid:.+}.html`  | 栏目ID| 手机浏览器: `/mobile/album/list` <br/> 微信浏览器: `/mobile/album/list` <br/> 微信小程序: `/album/list` |  图集栏目列表页 |
| /desktop/album/recommend | 图集推荐列表页  | `/album/recommend/{rid:.+}.html` | 推荐别名  |手机浏览器: `/mobile/album/recommend` <br/> 微信浏览器: `/mobile/album/recommend` <br/> 微信小程序: `/album/recommend` | 图集推荐列表页 |
| /desktop/album/detail | 图集详情页 | `/album/{id:[0-9a-zA-Z]+}.html`  | 文章ID  |手机浏览器: `/mobile/album/detail` <br/> 微信浏览器: `/mobile/album/detail` <br/> 微信小程序: `/album/detail` | 图集详情页 |
| /desktop/event/list | 活动栏目列表页  | `/event/list/{cid:.+}.html`  | 栏目ID| 手机浏览器: `/mobile/event/list` <br/> 微信浏览器: `/mobile/event/list` <br/> 微信小程序: `/event/list` |  图集栏目列表页 |
| /desktop/event/recommend | 活动推荐列表页  | `/event/recommend/{rid:.+}.html` | 推荐别名  |手机浏览器: `/mobile/event/recommend` <br/> 微信浏览器: `/mobile/event/recommend` <br/> 微信小程序: `/event/recommend` | 活动推荐列表页 |
| /desktop/event/detail | 活动详情页 | `/event/{id:[0-9a-zA-Z]+}.html`  | 文章ID  |手机浏览器: `/mobile/event/detail` <br/> 微信浏览器: `/mobile/event/detail` <br/> 微信小程序: `/event/detail` | 活动详情页 |
| /desktop/article/special | 专题页  | `/special/{sid:.+}.html` <br/>  `/article/special/{sid:.+}.html`  | 专题别名  |手机浏览器: `/mobile/article/special` <br/> 微信浏览器: `/mobile/article/special` <br/> 微信小程序: `/article/special` | 专题页 |


**通用文件清单**

| 文件/文件夹 | 书名 |
| --- | --- |
| /desktop/common/head.page | 全局头部布局 |
| /desktop/common/foot.page | 全局尾部布局 |
| /desktop/common/nav_top.page | 头部导航布局 |
| /desktop/common/var.less | 全局样式常量定义 |
| /desktop/common/desktop.less | 全局样式表 |
| /desktop/assets/js/* | 第三方js脚本 |
| /desktop/assets/css/* | 第三方CSS样式表 |
| /desktop/assets/images/* | 静态图片文件 |
| /desktop/assets/fonts/* | WEB字体文件 |


### 1.2.2 修改页面

### 1.2.3 新增页面

## 1.3 手机模板

### 1.3.1 页面清单

### 1.3.2 修改页面

### 1.3.3 新增页面

## 1.4 小程序

## 1.5 Android ( React Native )

## 1.6 iOS ( React Native )

## 1.7 API 清单


# 二、后端开发

## 2.1 简墨应用
