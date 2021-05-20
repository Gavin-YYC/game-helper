
# 游戏辅助

练习项目，typescript + electron + webpack + vue + 大漠插件

## 大漠注册

在项目根目录在创建`.reginfo.json`文件，内容如下：

```
{
    "reg_code": "",
    "ver_info": ""
}
```

## 项目构建

```
node: 12.18.3（32位）
winax: 3.1.3
electron: 6.0.0
```

**安装依赖**

```
npm i
npm run rebuild
```

**启动项目**

```
npm run dev
```

会先编译renderer，然后在启动electron项目。

**构建**

```
npm run build
```

**打包**

```
npm run packager
```