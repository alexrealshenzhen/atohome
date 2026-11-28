# atohome

面向家居品牌的响应式展示站，使用原生 HTML、CSS 和 JavaScript 实现，无需安装依赖或构建。

## 本地预览

在项目目录运行：

```bash
python -m http.server 4173
```

访问 `http://localhost:4173`。也可直接打开 `index.html`。

## 内容配置

所有页面文案与图片统一在 `site.config.js` 中维护，修改后刷新页面即可生效。

| 配置项 | 用途 |
| --- | --- |
| `brand` / `meta` | 品牌名称、页面标题、描述与语言 |
| `copy` | 导航、轮播、各内容区块、页尾及表单文案 |
| `media` | Logo、轮播、产品、技术图及背景图地址 |
| `products` / `categories` | 商品信息、价格、图片引用及分类名称 |
| `ui` / `info` | 按钮、交互提示、无障碍标签及说明弹窗 |
| `promotion` / `technology` | 活动截止时间、结束文案及技术切换图片 |
| `links` / `format` | 品牌外链、金额显示语言与币种 |

图片地址支持相对路径和 HTTP(S) URL；本地素材放在 `assets/`。`products[].image` 和 `technology.images[].image` 引用 `media` 中的键名。图片替代文字由对应区块、技术配置和 `ui.product.imageAlt` 管理。

文案中的 `{brand}` 自动引用 `brand.name`；`{name}`、`{count}` 等占位符由交互提供，修改时请保留。商品 `id` 和分类键应保持稳定，以兼容已有购物车、收藏和导航。页面结构与样式分别由 `index.html` 和 `styles.css` 维护。

## 部署

推送至 `main` 后，由 GitHub Actions 自动部署到 GitHub Pages。工作流仅发布页面、配置、脚本、样式和素材，使用 GitHub 自动提供的令牌，无需额外部署密钥。

仓库 Pages 来源使用 **GitHub Actions**；自定义域名为 `atohome.cn`，由仓库 Pages 设置及 `CNAME` 共同维护。更换域名时需同时更新域名解析。

## 使用边界

本站为前端展示与交互演示，未接入账号、支付或邮件订阅服务。购物车与收藏仅保存在当前浏览器。

素材来源记录于 `assets/asset-sources.json`。品牌、字体和图片权利归原权利人，商用前须确认授权。
