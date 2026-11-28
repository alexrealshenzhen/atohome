# atohome

面向家居品牌的响应式展示站，使用原生 HTML、CSS 和 JavaScript 实现，无需安装依赖或构建。

## 本地预览

在项目目录运行：

```bash
python -m http.server 4173
```

访问 `http://localhost:4173`。也可直接打开 `index.html`。

## 内容配置

商品、图片与服务配置在 `site.config.js` 中维护；英语和西班牙语文案分别在 `locales/en.js`、`locales/es.js` 中维护，修改后刷新页面即可生效。

| 配置项 | 用途 |
| --- | --- |
| `brand` / `defaultLanguage` | 品牌名称与默认语言 |
| 语言文件 `meta` / `copy` | 页面标题、描述、导航、轮播、各内容区块、页尾及表单文案 |
| `media` | Logo、轮播、产品、技术图及背景图地址 |
| `products` / `categoryIds` / `featuredProducts` | 共享商品数据、三分类 ID 与首页推荐商品 ID |
| 语言文件 `categories` / `productText` | 分类名称与按稳定 ID 关联的商品文案 |
| 语言文件 `ui` / `info` | 按钮、交互提示、无障碍标签及说明弹窗 |
| `promotion` / `technology` | 活动截止时间、结束文案及技术切换图片 |
| `links` / `format` | 品牌外链、金额显示语言与币种 |
| `newsletter` | Google Apps Script 订阅地址、超时时间与联系邮箱 |

图片地址支持相对路径和 HTTP(S) URL；本地素材放在 `assets/`。`products[].image` 和 `technology.images[].image` 引用 `media` 中的键名。图片替代文字由对应区块、技术配置和 `ui.product.imageAlt` 管理。

文案中的 `{brand}` 自动引用 `brand.name`；`{name}`、`{count}` 等占位符由交互提供，修改时请保留。商品 `id` 和分类键应保持稳定，以兼容已有购物车、收藏和导航。页面结构与样式分别由 `index.html` 和 `styles.css` 维护。

语言文件 `productText` 中的 `summary`、`specifications` 和 `features` 管理商品摘要、规格与功能。未提供售价及评分时在共享商品配置中设为 `null`，页面展示详情入口，不显示虚构价格或评分，也不加入购物车。

分类固定为 `air`、`car-air`、`hair-dryer`；车载类别暂无商品时显示明确提示。页头可切换 English / Español，语言选择顺序为 URL 的 `?lang=en` 或 `?lang=es`、浏览器保存的偏好、默认英语。切换保留当前筛选、搜索、详情和购物车状态；下架历史商品保留记录并提示不可购买。两份语言文件须保持键、数组长度和占位符一致。

在项目目录运行 `node --test tests/*.test.cjs`，可验证语言覆盖、分类、发布清单和 Google 联系人处理逻辑，不会访问真实通讯录。

## 部署

推送至 `main` 后，由 GitHub Actions 自动部署到 GitHub Pages。工作流仅发布页面、配置、脚本、样式和素材，使用 GitHub 自动提供的令牌，无需额外部署密钥。

仓库 Pages 来源使用 **GitHub Actions**；自定义域名为 `atohome.cn`，由仓库 Pages 设置及 `CNAME` 共同维护。更换域名时需同时更新域名解析。

## 使用边界

本站未接入账号或支付服务。购物车与收藏仅保存在当前浏览器。

邮件订阅将邮箱保存到 `info.atohome@gmail.com` 的 Google 通讯录，并加入 `atohome Subscribers` 标签。两个入口共用流程，只有 Google 脚本确认保存后才显示成功。部署步骤与名单管理见 [Gmail 订阅接入](google-apps-script/README.md)。未配置 `newsletter.endpoint` 时订阅明确未开放；无需邮箱密码、SMTP、数据库或独立服务器。后续邮件由运营人员在 Gmail 发送，退订请求通过联系邮箱人工处理。

素材来源记录于 `assets/asset-sources.json`。品牌、字体和图片权利归原权利人，商用前须确认授权。
