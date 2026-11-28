# Gmail 通讯录订阅接入

网站提交的邮箱保存到 **info.atohome@gmail.com** 的 Google 通讯录，并加入 **atohome Subscribers** 标签。已有联系人只增加标签，不修改姓名、备注或其他标签；重复订阅复用联系人。此版本直接保存，不发送确认邮件或欢迎邮件，不使用 SMTP、邮箱密码、QQ 授权码、独立数据库或服务器。

## 一次性部署

1. 使用 `info.atohome@gmail.com` 登录 [Google Apps Script](https://script.google.com/home)，新建独立项目。
2. 将本目录 `Code.gs` 的全部内容复制到项目的同名文件。
3. 在项目设置中启用“在编辑器中显示 appsscript.json 清单文件”，用本目录 `appsscript.json` 替换清单。清单开启 **People API v1** 和联系人访问权限。若使用自建 Google Cloud 项目，还需在该 Cloud 项目启用 Google People API；默认 Apps Script Cloud 项目通常自动启用。
4. 在编辑器中选择并运行 `setupNewsletter`，按 Google 授权页允许该项目访问通讯录。该操作会创建订阅标签，不新增测试联系人。运行账号必须与脚本配置的邮箱一致。
5. 选择“部署 → 新部署 → 网络应用”：**执行身份选择我（info.atohome@gmail.com）**，访问权限选择 **任何人**。如果账号策略没有“任何人”，此方案无法接收匿名网站访客，不能以“仅限已登录用户”替代。
6. 复制部署地址，格式为 `https://script.google.com/macros/s/部署ID/exec`，填入项目 `site.config.js` 的 `newsletter.endpoint`。使用 `/exec` 正式地址，不使用 `/dev` 测试地址。
7. 提交并部署网站。初次可以先在 `Code.gs` 的 `NEWSLETTER.origins` 中添加本地 HTTP 预览地址的精确来源（例如 `http://127.0.0.1:4173`），在本地测试后移除。脚本更新后通过“管理部署 → 编辑 → 新版本”更新同一部署。

**需要在你自己的 Google 账号内授权。** 提供 Gmail 地址无法代替账号授权；不要将邮箱密码或授权令牌发送到代码仓库。

## 名单与发送

- 打开 [Google 通讯录](https://contacts.google.com/)，确认当前账号是 `info.atohome@gmail.com`，点击 **atohome Subscribers** 查看/导出名单。
- 在 Gmail 收件人栏输入标签名，可以选择该组联系人。向多个联系人发送时使用密送，避免公开收件人地址；发送数量仍受 Gmail 账号额度限制。
- 后续活动内容、发送频率和实际群发由运营人员在 Gmail 维护，本版本不自动发送邮件。
- 网站明确提供退订邮箱 `info.atohome@gmail.com`。收到退订请求后，从该联系人移除 **atohome Subscribers** 标签即可；保留其他联系人资料和标签。后续发信只选此标签，避免继续发送给已退订者。
- 移除标签属于人工退订，本版本没有自动退订链接或退订抑制名单，不应对外承诺这些能力。

## 配置与运行行为

- `Code.gs` 中的 `NEWSLETTER.owner`、`label`、`origins` 分别管理接收账号、订阅标签和允许页面来源。
- 来源白名单用于约束页面响应目标，不是匿名公开端点的身份认证。公开接口还使用输入校验、隐藏反机器人字段、同地址一分钟间隔、每日 250 次处理上限和串行锁，限制接口消耗；无法防住所有自动化提交。地址所有权在本版本未经邮件确认。
- Apps Script 的来源参数由客户端发送，不能作为可信 HTTP Origin；没有将它当作服务鉴权。新增验证码或双重确认需另行设计。
- 订阅邮箱只保存在 Google 通讯录；脚本缓存只临时保存邮箱摘要/重试窗口，脚本属性只保存每日计数，不保留第二份名单。
- 修改人数上限应结合 Google 配额；服务失败会记录脱敏日志并向表单返回失败，不能根据 iframe 加载完成推断保存成功。
- 新增联系人与标签使用 People API；精确邮箱查重使用联系人分页读取，未用可能延迟更新的模糊搜索结果作唯一依据。Google 联系人更新仍可能存在短暂延迟，缓存与脚本锁用于降低短时间重复。
- 网站通过隐藏表单 POST 提交，Google 的 HtmlService 响应发送带随机请求 ID 的消息。网站只接受 Google 脚本内容域、匹配请求 ID 和已知状态，避免读取被浏览器跨域限制的 fetch 结果，也不使用 `no-cors` 假成功。
- 地址未配置或配置不合法时显示“Email subscriptions are not available yet”，禁用按钮。离线 `file://` 预览不支持订阅；线上使用 HTTPS。

## 验收

1. 先用一个由你控制的邮箱提交，页面显示订阅成功后，到 Google 通讯录对应标签下核对。
2. 等待至少一分钟重复提交同一邮箱，确认复用联系人，不额外新增；已有联系人加入标签时原姓名和标签不变。
3. 分别验证 Stay Informed 和页尾入口：无效邮箱、未勾选同意、提交中、成功、脚本权限/配额错误和请求超时。
4. 退订验收：从标签移除测试联系人，下一次群发时只使用该标签，确认不再包含该地址。
5. 检查未启用 People API、部署账号错误或访问权限不是“任何人”时，不显示虚假成功。

本地模拟测试只覆盖代码与跨域响应协议；**真实 Google 账号授权、部署和通讯录保存需单独验收**。没有填写实际部署 URL 前，网站不会收集订阅邮箱。

联系人处理自动测试：在项目根目录运行 `node --test tests/newsletter-contacts.test.cjs`，无需安装测试依赖，不会访问真实通讯录。

参考：[Apps Script People 服务](https://developers.google.com/apps-script/advanced/people)、[网络应用部署](https://developers.google.com/apps-script/guides/web)、[创建联系人](https://developers.google.com/people/api/rest/v1/people/createContact)、[标签成员](https://developers.google.com/people/api/rest/v1/contactGroups.members/modify)。
