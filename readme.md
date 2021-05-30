
# Auto Game

瞎玩系列

## 技术栈

- typescript
- electron
- webpack
- vue
- vuex
- vue-router
- less
- 大漠插件

加载动态库文件、一键启动环境，main进程、render进程自动重启、加载flash插件。

## 大漠注册

在项目根目录在创建`.reginfo.json`文件，内容如下：

```
{
    "regCode": "",
    "verInfo": ""
}
```

## 项目构建

```
node: 12.18.3（32位）
winax: 3.1.4
electron: 11.4.7
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

## 备注

powershell 临时解决中文乱码问题：`chcp 65001`