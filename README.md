# Sam-GitHub 去除中文搜索污染

一个用于 GitHub 搜索页的 Tampermonkey userscript，用来隐藏疑似关键词污染、血腥暴力、反华/反动宣传、强政治噪声等搜索结果。脚本只在本地浏览器中运行，不会上传搜索内容或访问远程配置。

## 功能特性

- 过滤 GitHub 搜索结果中的指定用户、仓库名和仓库名关键词。
- 支持项目名模糊匹配，可覆盖 `dictatorship` 一类变体拼写。
- 支持结果摘要文本过滤，包含血腥、暴力、反华、反动、强政治污染等高置信短语。
- 使用加权评分降低误杀：普通政治词单独出现不会直接屏蔽，多个高风险短语组合出现才触发。
- 通过 `MutationObserver` 监听动态加载结果，适配 GitHub 搜索页滚动和刷新。
- 支持浏览器本地自定义规则，无需每次修改源码。

## 安装方式

1. 安装 Tampermonkey、Violentmonkey 或兼容的 userscript 管理器。
2. 打开仓库中的 `sam-github-remove-chinese-search-results.user.git.js`。
3. 将脚本内容复制到 userscript 管理器中新建脚本中并保存。
4. 访问 `https://github.com/search?...`，脚本会自动隐藏命中的搜索结果。

如果后续配置了 `@downloadURL` / `@updateURL`，可以改为通过 Raw 文件地址安装自动更新版本。

## 过滤规则

脚本内置几类规则：

- `blockedUsers`：按 GitHub 用户名屏蔽。
- `blockedProjectNames`：按完整仓库名屏蔽，例如 `pcl2`。
- `blockedProjectKeywords`：按仓库名关键词屏蔽，并支持轻微拼写变体。
- `directBlockedTextPhrases`：命中即屏蔽的高置信短语。
- `scoredBlockedTextPhrases`：加权短语，累计分数达到阈值后屏蔽。

新增规则时优先选择高置信短语，不建议把过宽泛的词单独放进直接屏蔽列表。例如“政治”本身太宽，适合放在组合判断里，而不是命中即删。

## 本地自定义规则

可以在 GitHub 页面控制台中写入本地规则：

```js
localStorage.setItem("samGithubSearchCleanerRules", JSON.stringify({
  users: ["example-user"],
  projectNames: ["example-repo"],
  projectKeywords: ["toxicfork"],
  textPhrases: ["自定义污染短语"]
}));
```

刷新 GitHub 搜索页后生效。清除自定义规则：

```js
localStorage.removeItem("samGithubSearchCleanerRules");
```

## 开发与测试

本仓库不依赖 npm 包，使用 Node 内置测试能力。

```powershell
node --check sam-github-remove-chinese-search-results.user.git.js
node --test tests/filter-rules.test.cjs
git diff --check
```

测试覆盖截图类搜索污染、可预见政治噪声、血腥暴力文本、自定义规则以及正常结果不过滤。新增过滤规则时，应同步补充 `tests/filter-rules.test.cjs`，避免误杀回归。

## 项目结构

```text
.
├── sam-github-remove-chinese-search-results.user.git.js  # userscript 主文件
├── tests/filter-rules.test.cjs                           # 规则回归测试
├── AGENTS.md                                             # 贡献指南
└── README.md                                             # 项目说明
```

## 隐私与限制

脚本只读取当前 GitHub 搜索页 DOM，并在本地删除匹配的结果卡片。它不会联网请求第三方服务，也不会上传浏览记录。

由于 GitHub 页面结构可能变化，结果卡片定位逻辑未来可能需要维护。过滤规则也无法替代人工判断，建议把特别个人化或容易误杀的规则放进本地自定义配置，而不是直接写进内置列表。

## 许可证

本项目采用 GNU General Public License v3.0，SPDX 标识为 `GPL-3.0-only`。详见 [LICENSE](./LICENSE)。
