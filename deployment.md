# 部署说明

## 下载代码

```
git clone https://github.com/EnObj/man-power-ai-wx.git
```

## 导入到微信开发者工具

如果还没有安装开发工具，可以到[下载页](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)下载。

1. 设置项目名称
2. 选择源代码包本地路径
3. 填写您的小程序appid（需要您提前到[微信公众平台](https://mp.weixin.qq.com)申请）
4，点击确认

## 开启云服务

参见[官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 部署云函数

云函数位于[cloudfunctions]('./cloudfunctions')目录下。

只有一个云函数需要部署：loadMpaContent，部署方式参见[官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 创建数据表

所有数据表见[doc/table]('doc/table')下的json文件，每个json文件代表一个表，文件名即表名称，打开json文件可以看到需要配置的数据权限配置和索引，依次在数据库里创建好即可。

## 上传基础数据

基础数据即你使用此程序运行的内容，如一开始提到的英语单词，成语/歇后语等等，这里我给大家提供了两个例子参考：

- 全国博物馆
- 全国高等院校

可以导入到你的数据表里，作为实验数据，后续具体运营的数据需要你自己去收集。

## 修改参数

完成以上云服务的初始化后，只有一处代码配置需要修改：云服务ID，位于app.js文件内，修改成你对应的云服务ID保存即可。

## 完成

此时可以点击开发者工具的编译按钮查看小程序整体运行效果。