# quick-open-web-links
一个用于打开指定url的桌面应用

# 项目创建
该工程使用的useful-cli(1.0.8版本)创建

# 开发
```bash
# 本地调试
yarn dev

# 编译
yarn build:[env]

# 打包应用
yarn pack:[platform]:[env]

# 部署应用，该命令会将release-builds中的内容部署到线上，所以部署前需要先打包应用，部署新版本会触发应用更新
yarn only:publish:app:[env]

# 部署webview(渲染进程)，该命令编译打包渲染进程代码并将其部署到线上，部署新版本会触发热更新
yarn publish:renderer:[env]
```
