#qianyilc gulp

##使用方法：
需要安装以下软件及其环境

1. nodejs [下载地址](https://nodejs.org/en/)
2. git [下载地址](http://git-scm.com/download/)
3. 环境配置(依次执行以下命令)
```
npm install cnpm -g --registry=https://registry.npm.taobao.org  //修改npm源地址
cnpm install -g gulp                                            //安装全局gulp
```
完成之后在FED位置执行 `cnpm install`

以下为所有`task`
```
gulp             //默认task
gulp rem
gulp bak         //备份原始图片
gulp min         //压缩图片
gulp clean       //删除原始图片
```

