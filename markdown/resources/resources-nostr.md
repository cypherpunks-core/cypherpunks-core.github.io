---
title: Nostr 資源
subtitle: Nostr Protocol Resources
layout: page
# callouts: home_callouts
# hide_hero: true
hero_image: /img/hero.png
show_sidebar: true
hero_height: 0
---

> 最後更新：2025年

---

## 目錄

- [什麼是 Nostr](#什麼是-nostr)
- [核心概念](#核心概念)
- [客戶端](#客戶端)
- [中繼站](#中繼站relays)
- [NIP 規範](#nip-規範)
- [開發資源](#開發資源)
- [閃電網路整合](#閃電網路整合)
- [生態應用](#生態應用)

---

## 什麼是 Nostr

**Nostr**（Notes and Other Stuff Transmitted by Relays）是一個簡單、開放的協議，用於構建抗審查的全球社交網路。由比特幣開發者 fiatjaf 於 2020 年提出。

### 核心特點

| 特性 | 說明 |
|------|------|
| **去中心化** | 無單一故障點，任何人可運行中繼站 |
| **抗審查** | 用戶控制自己的身份和數據 |
| **簡單** | 協議極簡，易於實現 |
| **互操作** | 所有客戶端共享同一網路 |
| **閃電整合** | 原生支援比特幣閃電網路支付 |

### 官方資源

* **[Nostr 協議](https://github.com/nostr-protocol/nostr)** - 協議規範
* **[nostr.com](https://nostr.com/)** - 官方介紹網站
* **[Nostr.how](https://nostr.how/)** - 入門指南
* **[Nostr.net](https://nostr.net/)** - 資源目錄

---

## 核心概念

### 身份

Nostr 使用**公私鑰對**作為身份：
- **公鑰 (npub)** - 你的用戶 ID，可公開分享
- **私鑰 (nsec)** - 你的密碼，必須保密

公鑰以 `npub1...` 開頭，私鑰以 `nsec1...` 開頭（Bech32 編碼）。

### 事件 (Events)

所有 Nostr 數據都是「事件」：
- 由私鑰簽名
- 包含內容、標籤和時間戳
- 不可修改（只能發新事件）

### 中繼站 (Relays)

中繼站是存儲和轉發事件的服務器：
- 用戶選擇連接哪些中繼站
- 中繼站可自由選擇存儲哪些事件
- 無需許可即可運行

---

## 客戶端

### 網頁客戶端

* **[Snort](https://snort.social/)** - 功能豐富的網頁客戶端
* **[Primal](https://primal.net/)** - 快速、現代化界面
* **[Coracle](https://coracle.social/)** - 重視隱私的客戶端
* **[Nostrudel](https://nostrudel.ninja/)** - 功能完整的進階客戶端
* **[Iris](https://iris.to/)** - 簡潔的網頁客戶端

### 桌面客戶端

* **[Gossip](https://github.com/mikedilger/gossip)** - Rust 寫的桌面客戶端
* **[Lume](https://lume.nu/)** - 跨平台桌面應用

### 行動應用

**iOS:**
* **[Damus](https://damus.io/)** - 最流行的 iOS 客戶端
* **[Primal](https://primal.net/)** - 跨平台應用
* **[Nos](https://nos.social/)** - 注重用戶體驗

**Android:**
* **[Amethyst](https://github.com/vitorpamplona/amethyst)** - 功能最完整的 Android 客戶端
* **[Primal](https://primal.net/)** - 跨平台應用
* **[Plebstr](https://plebstr.com/)** - 簡單易用

---

## 中繼站(Relays)

### 公共中繼站

* `wss://relay.damus.io`
* `wss://relay.snort.social`
* `wss://relay.primal.net`
* `wss://nos.lol`
* `wss://nostr.wine`

### 中繼站目錄

* **[nostr.watch](https://nostr.watch/)** - 中繼站狀態監控
* **[Nostr Band Relays](https://stats.nostr.band/)** - 中繼站統計

### 運行自己的中繼站

* **[strfry](https://github.com/hoytech/strfry)** - 高效能 C++ 中繼站
* **[nostr-rs-relay](https://github.com/scsibug/nostr-rs-relay)** - Rust 中繼站
* **[nostream](https://github.com/Cameri/nostream)** - TypeScript 中繼站

---

## NIP 規範

NIP（Nostr Implementation Possibilities）定義了協議的各種功能：

### 核心 NIP

| NIP | 名稱 | 說明 |
|-----|------|------|
| **[NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md)** | Basic Protocol | 基本協議定義 |
| **[NIP-02](https://github.com/nostr-protocol/nips/blob/master/02.md)** | Contact List | 關注列表 |
| **[NIP-04](https://github.com/nostr-protocol/nips/blob/master/04.md)** | Encrypted DM | 加密私訊 |
| **[NIP-05](https://github.com/nostr-protocol/nips/blob/master/05.md)** | DNS Identity | 人類可讀的身份驗證 |

### 重要 NIP

| NIP | 名稱 | 說明 |
|-----|------|------|
| **[NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md)** | Browser Extensions | 瀏覽器擴展 API |
| **[NIP-19](https://github.com/nostr-protocol/nips/blob/master/19.md)** | Bech32 Entities | npub/nsec 編碼 |
| **[NIP-57](https://github.com/nostr-protocol/nips/blob/master/57.md)** | Zaps | 閃電網路打賞 |

### 完整列表

* **[NIPs 規範庫](https://github.com/nostr-protocol/nips)** - 所有 NIP

---

## 開發資源

### 函式庫

**JavaScript/TypeScript:**
* **[nostr-tools](https://github.com/nbd-wtf/nostr-tools)** - 官方 JS 工具庫
* **[NDK](https://github.com/nostr-dev-kit/ndk)** - Nostr Dev Kit

**Rust:**
* **[nostr-sdk](https://github.com/rust-nostr/nostr)** - Rust SDK
* **[nostr](https://crates.io/crates/nostr)** - 核心庫

**Python:**
* **[python-nostr](https://github.com/jeffthibault/python-nostr)** - Python 客戶端庫

**Go:**
* **[go-nostr](https://github.com/nbd-wtf/go-nostr)** - Go 客戶端庫

### 瀏覽器擴展

* **[Alby](https://getalby.com/)** - 閃電錢包 + Nostr 簽名
* **[nos2x](https://github.com/fiatjaf/nos2x)** - 輕量級 Nostr 簽名擴展
* **[Nostr Connect](https://github.com/nicafantasy/nostr-connect)** - NIP-46 遠端簽名

### 工具

* **[Nostr Army Knife](https://nak.nostr.com/)** - 調試工具
* **[Nostr Band](https://nostr.band/)** - 搜索和統計
* **[Nosta](https://nosta.me/)** - 個人資料頁面

---

## 閃電網路整合

### Zaps (NIP-57)

Zaps 是 Nostr 原生的閃電網路打賞功能：

1. 用戶在個人資料設置閃電地址
2. 其他人可對貼文發送聰（satoshis）
3. 交易記錄在鏈上可驗證

### 閃電地址服務

* **[Alby](https://getalby.com/)** - `yourname@getalby.com`
* **[Wallet of Satoshi](https://www.walletofsatoshi.com/)** - 簡單設置
* **[LNURL](https://github.com/lnurl/luds)** - 閃電 URL 協議

### Zap 支援客戶端

大多數主流客戶端都支援 Zaps：
- Damus
- Primal
- Amethyst
- Snort
- Coracle

---

## 生態應用

### 長文寫作

* **[Habla](https://habla.news/)** - 長文發布平台
* **[Highlighter](https://highlighter.com/)** - 寫作和閱讀平台

### 直播

* **[Zap.stream](https://zap.stream/)** - 閃電網路打賞直播

### 音樂

* **[Wavlake](https://wavlake.com/)** - 音樂串流平台
* **[Fountain](https://fountain.fm/)** - Podcast 應用

### 市場

* **[Plebeian Market](https://plebeian.market/)** - 去中心化市場

### 圖片分享

* **[nostr.build](https://nostr.build/)** - 圖片托管服務

### 其他

* **[Badges](https://badges.page/)** - 徽章系統
* **[Npub.pro](https://npub.pro/)** - 個人網站生成器

---

## 學習資源

### 入門指南

* **[Nostr.how](https://nostr.how/)** - 完整入門教程
* **[UseNostr.org](https://usenostr.org/)** - 使用指南
* **[Nostr Resources](https://nostr-resources.com/)** - 資源彙整

### 影片

* **[What is Nostr?](https://www.youtube.com/watch?v=5W-jtbbh3eA)** - 概念介紹
* **[BTC Sessions: Nostr Tutorial](https://www.youtube.com/watch?v=qn-Zp491t4Y)** - 設置教程

### 社群

* **[Nostr Telegram](https://t.me/nostr_protocol)** - Telegram 群組
* **[Nostr Reddit](https://www.reddit.com/r/nostr/)** - Reddit 社群
* 在 Nostr 上關注 `#nostr` 標籤

---

## 密碼龐克精神

Nostr 體現了密碼龐克的核心價值：

> "密碼龐克編寫代碼。我們知道必須有人編寫軟體來保護隱私，而且...我們將親自編寫它。"
> — Eric Hughes, A Cypherpunk's Manifesto (1993)

Nostr 代表：
- **自主身份** - 你控制你的密鑰
- **言論自由** - 抗審查的通訊
- **開放協議** - 任何人都可以參與
- **比特幣原生** - 與閃電網路深度整合
