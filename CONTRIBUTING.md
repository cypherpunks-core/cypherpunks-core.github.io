# 貢獻指南

感謝您對 Cypherpunks Taiwan 的興趣！以下是如何參與貢獻的指南。

## 新增文章

### 文章位置

所有部落格文章存放於 `/_posts/` 目錄。

### 文件命名格式

```
YYYY-MM-DD-文章標題.markdown
```

範例：`2025-01-07-比特幣閃電網路入門.markdown`

### Front Matter 模板

```yaml
---
layout: post
title: "文章標題"
date: 2025-01-07
description: "文章簡短描述（用於 SEO）"
image: /img/your-image.png
published: true
categories:
  - 技術教學/bitcoin
tags:
  - bitcoin
  - lightning-network
---

文章內容...
```

### 分類規範

主要分類：
- `news` - 新聞資訊
- `技術教學/bitcoin` - Bitcoin 技術教程
- `meetup` - 社群活動

### 圖片規範

- 圖片存放於 `/img/` 目錄
- Blog 圖片尺寸：800 x 600（寬度必須 800）
- 圖片格式：PNG 或 JPG
- 命名格式：`作者名-描述.png`

## 新增書籍/論文

書籍與論文存放於 `/_products/` 目錄，使用類似的 Front Matter 格式。

## 新增資源頁面

資源頁面位於 `/markdown/resources/` 目錄。

## 開發注意事項

### CSS 變更

1. 修改 `/assets/css/main.css`
2. 執行 `npm run css:build` 重新編譯
3. 或使用 `npm run css:watch` 進行即時監聽

### 測試

提交前請確保：
1. 本地 `bundle exec jekyll serve` 正常運行
2. 頁面無明顯視覺問題
3. 連結無失效

## 提交規範

### Commit 訊息格式

```
類型: 簡短描述

feat: 新增閃電網路教學文章
fix: 修復導航列在手機上的顯示問題
docs: 更新 README 安裝說明
style: 調整程式碼區塊樣式
```

### Pull Request 流程

1. Fork 專案並建立功能分支
2. 完成修改並本地測試
3. 提交 Pull Request 至 `master` 分支
4. 等待 CI 檢查通過
5. 等待審核與合併

## 問題回報

如發現問題，請透過 [GitHub Issues](https://github.com/cypherpunks-core/cypherpunks-core.github.io/issues) 回報。

## 討論

技術討論與問題請至 [GitHub Discussions](https://github.com/cypherpunks-core/cypherpunks-core.github.io/discussions)。
