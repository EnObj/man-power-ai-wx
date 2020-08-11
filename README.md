# 百词百科

百词百科是一款在线教育/信息查询类目小程序，通过背后的随机推荐算法，给用户带来清新脱俗的学习和浏览体验，可应用与如下领域：

- 学习外语单词
- 刷应试题
- 浏览成语/歇后语
- 浏览国家颁布的法律条文

## 项目截图

![首页](https://7072-prod-qu44i-1302681016.tcb.qcloud.la/product_info/%E9%A6%96%E9%A1%B5.PNG)

![单词本](https://7072-prod-qu44i-1302681016.tcb.qcloud.la/product_info/%E5%8D%95%E8%AF%8D%E6%9C%AC.PNG)

![历史记录](https://7072-prod-qu44i-1302681016.tcb.qcloud.la/product_info/%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.PNG)

![收藏](https://7072-prod-qu44i-1302681016.tcb.qcloud.la/product_info/%E6%94%B6%E8%97%8F.PNG)

![设置页](https://7072-prod-qu44i-1302681016.tcb.qcloud.la/product_info/%E7%AE%A1%E7%90%86%E9%A1%B5.PNG)

![搜索结果](https://7072-prod-qu44i-1302681016.tcb.qcloud.la/product_info/%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.PNG)

## 线上体验

【此处放小程序码】

## 下载代码

```
git clone https://github.com/EnObj/man-power-ai-wx.git
```

## 导入到微信开发者工具

[开发者工具下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

1. 步骤1
2. 步骤2
3. 步骤3

## 开启云服务

参见[官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 部署云函数

  只有一个云函数需要部署：loadMpaContent，部署方式参见[官方文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## 创建数据表

所有数据表见doc/table下的json文件，每个json文件代表一个表，文件名即表名称，打开json文件可以看到需要配置的数据权限配置和索引，依次在数据库里创建好即可。

## 上传基础数据

基础数据即你使用此程序运行的内容，如一开始提到的英语单词，成语/歇后语等等，这里我给大家提供了两个例子参考：

- 全国博物馆：数据来源于国务院-文化与旅游部门公开数据
- 全国高等院校：数据来源于教育部

可以导入到你的数据表里，作为实验数据，后续具体运营的数据需要你自己去搜集。

## 修改参数

完成以上云服务的初始化后，只有一处代码配置需要修改：云服务ID，位于app.js文件内，修改成你对应的云服务ID保存即可。

## 完成

此时可以点击开发者工具的编译按钮查看小程序整体运行效果。

## 联系作者

使用过程中有任何问题都可以联系我，有代码上的问题欢迎提交issue和pull request，我都会处理。

如果有其他问题也可以通过以下联系方式找我：

- 邮箱：laoji52125@163.com