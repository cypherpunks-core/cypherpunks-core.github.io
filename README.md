# Cypherpunks Taiwan

> Cypherpunks Write Code - 密碼學使自由和隱私再次偉大

[![Deploy](https://github.com/cypherpunks-core/cypherpunks-core.github.io/actions/workflows/run.yml/badge.svg)](https://github.com/cypherpunks-core/cypherpunks-core.github.io/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Cypherpunks Taiwan 社群官方網站，專注於比特幣、密碼學、隱私技術等主題的教育與推廣。

**網站**: [https://cypherpunks-core.github.io](https://cypherpunks-core.github.io)

## 內容涵蓋

- Bitcoin 比特幣技術
- Lightning Network 閃電網路
- Taproot & Schnorr 簽名
- 區塊鏈隱私技術
- Nostr 去中心化協議
- 自託管與密鑰管理

## 本地開發

### 環境需求

- Ruby 3.x
- Node.js 18+
- Bundler

### 安裝步驟

```bash
# 克隆專案
git clone https://github.com/cypherpunks-core/cypherpunks-core.github.io.git
cd cypherpunks-core.github.io

# 安裝 Ruby 依賴
bundle install

# 安裝 Node 依賴
npm install

# 編譯 CSS
npm run css:build

# 啟動本地開發伺服器
bundle exec jekyll serve
```

瀏覽器開啟 http://127.0.0.1:4000 即可預覽。

### 開發指令

| 指令 | 說明 |
|------|------|
| `npm run css:build` | 編譯 Tailwind CSS |
| `npm run css:watch` | 監聽 CSS 變更 |
| `bundle exec jekyll serve` | 啟動開發伺服器 |
| `bundle exec jekyll build` | 建置網站 |

## 專案結構

```
cypherpunks-core.github.io/
├── _posts/              # 部落格文章
├── _products/           # 書籍與論文
├── _layouts/            # 頁面佈局模板
├── _includes/           # 可重用組件
├── _data/               # 資料檔案（導航等）
├── _sass/               # Sass 樣式
├── assets/
│   ├── css/             # CSS 入口
│   └── js/              # JavaScript
├── img/                 # 圖片資源
├── markdown/
│   ├── resources/       # 資源頁面
│   └── knowledge/       # 知識庫
├── _config.yml          # Jekyll 配置
├── Gemfile              # Ruby 依賴
├── package.json         # Node 依賴
└── tailwind.config.js   # Tailwind 配置
```

## 如何貢獻

請參閱 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何參與貢獻。

### 快速開始

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/my-feature`)
3. 提交變更 (`git commit -m 'Add new feature'`)
4. 推送至分支 (`git push origin feature/my-feature`)
5. 開啟 Pull Request

## 授權

本專案採用 [MIT 授權](LICENSE)。

## 社群連結

- [GitHub](https://github.com/cypherpunks-core)
- [Twitter](https://twitter.com/CypherpunksTW)
