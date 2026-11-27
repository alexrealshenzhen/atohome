# atohome 品牌展示站

采用原生 HTML / CSS / JavaScript 实现的 atohome 品牌首页。图片与 Gilroy 字体均放在 `assets/`，无需安装依赖或构建，可离线查看。

## 预览

直接用浏览器打开 `index.html`，或在当前目录启动静态服务：

```powershell
cd E:\projects\all-in-monitor\levoit-clone
python -m http.server 4173 --bind 127.0.0.1
```

访问 <http://127.0.0.1:4173>。

## 已实现

- 官网风格半透明导航、滚动吸顶、桌面探索菜单、手机导航。
- 五屏轮播、点击分页、暂停、触摸切换与减少动态效果支持。
- 品牌介绍、促销倒计时、三种选购场景、五类产品、技术切换、VeSync 展示和完整页尾。
- 本地商品列表、搜索、分类筛选、收藏、商品详情。
- 本地购物车、数量增减、删除、合计和刷新持久化。
- 原生 dialog 模态窗口、键盘关闭、焦点约束、表单邮件格式校验。
- 桌面、平板和手机响应式布局。

## 演示范围

纯前端仿写，未接入 Shopify、账号、支付、邮件订阅或追踪。商品价格、评分和展示数据仅用于演示；部分沿用参考页，其他为示例。结账和订阅会明确说明未提交。购物车和收藏只存于浏览器 localStorage。

公开图片的真实来源见 `assets/asset-sources.json`；来源地址用于素材溯源，不随页面品牌替换。字体来自参考站引用的 Shopify CDN，品牌、字体和图片权利归原权利人。图片内原有的产品商标未作修图。商用前请确认相应授权。

页面文字、字标、辅助说明和浏览器标题统一使用 `atohome`；原品牌外链已改为站内演示说明。本地存储使用 `atohome-storefront-preview-v1`，原演示数据仍保留在原存储键中。

主要文件：`index.html` 页面结构、`styles.css` 响应式样式、`app.js` 统一商品数据与交互。

## GitHub Pages 部署

目标仓库：<https://github.com/alexrealshenzhen/atohome>；自定义域名：<https://atohome.cn>。

`.github/workflows/pages.yml` 在推送到 `main` 时自动部署，也可在 Actions 页面手动运行。站点无需安装依赖或构建；工作流仅将 `index.html`、`styles.css`、`app.js`、`assets/`、`CNAME` 和 `.nojekyll` 打包发布，README、Git 配置与本地验收产物不进入站点。

首次启用：

1. 打开仓库 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
2. 将 **Custom domain** 设为 `atohome.cn` 并保存。工作流部署时，`CNAME` 文件不能代替此项仓库设置。
3. 按下一节配置域名 DNS；返回 Pages 等待 DNS 检查和证书签发完成，再勾选 **Enforce HTTPS**。
4. 在 **Actions → Deploy atohome to GitHub Pages** 检查部署结果；必要时选择 **Run workflow** 重新运行。

GitHub Actions 使用 GitHub 自动提供的 `GITHUB_TOKEN`；工作流已声明 `contents: read`、`pages: write` 和 `id-token: write`，不需要另外添加部署私钥或个人 Token。

如果仓库是私有仓库，请先确认账号套餐支持该私有仓库启用 Pages；不要为部署而直接修改仓库可见性。

### atohome.cn 域名解析

在域名 DNS 管理面板，为根域名添加以下四条记录：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

如需同时访问 `www.atohome.cn`，再添加 `CNAME`：主机记录 `www`，记录值 `alexrealshenzhen.github.io`，不带协议、仓库名或路径。

同一个主机记录上如有旧站点的冲突 A/AAAA/CNAME 记录，先确认旧用途再替换；不要删除 MX、TXT 等其他业务记录。使用 Cloudflare 时，首次验证和签发证书期间先设为 DNS only。DNS 生效可能需要数小时，最长通常为 24 小时。

官方说明：

- [GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [管理 GitHub Pages 自定义域名](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

### 本机 GitHub 授权与同步

不要把 Token、密码或 SSH 私钥写入仓库、远端 URL 或聊天记录。当前 Windows 环境可通过 Git Credential Manager 进行设备授权：

```powershell
git credential-manager github login --device --no-ui --username alexrealshenzhen
```

按照终端提示，在 GitHub 设备授权页面输入一次性代码；凭据由系统凭据管理器保存。授权账号需要目标仓库的写入权限，以及新增或修改 `.github/workflows/` 的权限。

之后在本项目独立 Git 仓库中同步：

```powershell
git status
git add .github/workflows/pages.yml .gitignore .nojekyll CNAME README.md index.html styles.css app.js assets
git commit -m "Deploy atohome static site with GitHub Pages"
git push -u origin main
```

GitHub 显示 `Repository not found` 时，先确认仓库地址、仓库是否已经创建，以及当前授权账号是否有访问权限；不要使用强制推送覆盖远端历史。
