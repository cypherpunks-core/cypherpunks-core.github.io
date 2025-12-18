---
title: 閃電網路資源
subtitle: Lightning Network Resources
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

- [2020-2024 重大進展](#2020-2024-重大進展)
- [閃電網路概述](#閃電網路概述)
- [節點實現](#閃電網路節點實現)
- [錢包](#錢包)
- [節點管理工具](#節點管理工具)
- [區塊瀏覽器](#區塊瀏覽器)
- [開發資源](#開發資源)
- [學習資源](#學習資源)

---

## 2020-2024 重大進展

### Taproot 對閃電網路的影響

2021 年 Taproot 升級為閃電網路帶來重大改進：

* **[Point Time Locked Contracts (PTLCs)](https://bitcoinops.org/en/topics/ptlc/)** - 取代 HTLCs，提升隱私性
* **[MuSig2 多重簽名](https://bitcoinops.org/en/topics/musig/)** - 更高效的通道開關
* **[Taproot Assets (Taro)](https://docs.lightning.engineering/the-lightning-network/taproot-assets)** - 在閃電網路上發行和轉移資產

### BOLT 12 Offers（進行中）

* **[BOLT 12 規範](https://bolt12.org/)** - 改進的支付請求格式
* 支援重複支付和退款
* 更好的隱私保護（無需暴露節點公鑰）

### 通道管理進展

* **[Splicing](https://bitcoinops.org/en/topics/splicing/)** - 無需關閉通道即可增減容量
* **[Dual-Funded Channels](https://bitcoinops.org/en/topics/dual-funding/)** - 雙方同時注資開通道
* **[Channel Factories](https://bitcoinops.org/en/topics/channel-factories/)** - 多方共享通道

### LSP（Lightning Service Providers）

* **[LSP 規範](https://github.com/BitcoinAndLightningLayerSpecs/lsp)** - 標準化的閃電網路服務提供者接口
* **[Voltage](https://voltage.cloud/)** - 托管閃電節點服務
* **[Breez SDK](https://breez.technology/sdk/)** - 為開發者提供 LSP 功能

### 隱私改進

* **[Route Blinding](https://bitcoinops.org/en/topics/rendez-vous-routing/)** - 隱藏支付接收者
* **[Trampoline Routing](https://bitcoinops.org/en/topics/trampoline-payments/)** - 輕量級節點的隱私路由

---

## 閃電網路概述

閃電網路（Lightning Network）是工作在比特幣區塊鏈上的第二層支付協議。其設計目的是實現交易雙方的即時交易，而區塊鏈的交易頻率則受限於其容量。

> 閃電網路是一個提議端到端連接的雙向支付通道路由網路。像這樣的網路可以允許任何參與者在無需信任任何中間人的情況下將支付從通道發送到通道。[閃電網路](https://lightning.network/lightning-network-paper.pdf)由 Joseph Poon 和 Thadeus Dryja 於 2015 年 2 月首先描述。

### 主要來源

* **[lightning.engineering](https://lightning.engineering/)** - Lightning Labs 官方網站
* **[lightning.network](https://lightning.network/)** - 閃電網路官方網站
* **[BOLT 規範](https://github.com/lightning/bolts)** - 閃電網路互操作性標準

### 概念介紹

* **[Bitcoin Optech: Lightning Network](https://bitcoinops.org/en/topics/lightning-network/)** - 技術概述
* **[River Learn: Lightning Network](https://river.com/learn/what-is-the-lightning-network/)** - 入門介紹
* [動區 - 五分鐘就看懂：圖說閃電網路](https://www.blocktempo.com/lightning-network/)
* [維基百科 - 閃電網路](https://zh.wikipedia.org/wiki/%E9%97%AA%E7%94%B5%E7%BD%91%E7%BB%9C)

---

## 閃電網路節點實現

### 主要實現

* **[LND](https://github.com/lightningnetwork/lnd)** - Lightning Labs 開發，使用 Go 語言，最廣泛使用的實現
* **[Core Lightning (CLN)](https://github.com/ElementsProject/lightning)** - Blockstream 開發，使用 C 語言，強調模組化
* **[Eclair](https://github.com/ACINQ/eclair)** - ACINQ 開發，使用 Scala 語言
* **[LDK](https://lightningdevkit.org/)** - Lightning Dev Kit，Rust 函式庫，適合嵌入式應用

### 節點版本（2024）

| 實現 | 最新版本 | 特色 |
|------|---------|------|
| LND | v0.18+ | Taproot channels, HTLC endorsement |
| CLN | v24+ | Splicing support, Runes API |
| Eclair | v0.10+ | Dual-funded channels, Trampoline |
| LDK | v0.0.123+ | Modular, embeddable |

### 輕量級節點

* **[Neutrino](https://github.com/lightninglabs/neutrino)** - BIP 157/158 輕客戶端
* **[LDK Node](https://github.com/lightningdevkit/ldk-node)** - 基於 LDK 的即用型節點

---

## 錢包

> 注意：使用非託管錢包時，請務必備份助記詞和通道狀態。

### 自託管錢包（推薦）

* **[Phoenix](https://phoenix.acinq.co/)** - ACINQ 開發，自動通道管理，iOS/Android
* **[Breez](https://breez.technology/)** - 非託管，整合 POS 功能
* **[Mutiny Wallet](https://www.mutinywallet.com/)** - 網頁版非託管錢包
* **[Zeus](https://zeusln.app/)** - 連接自己節點的遠端控制錢包
* **[Blixt Wallet](https://blixtwallet.github.io/)** - 內建完整 LND 節點

### 桌面錢包

* **[Zap Desktop](https://zaphq.io/)** - 跨平台桌面錢包
* **[Spark Wallet](https://github.com/shesek/spark-wallet)** - CLN 的輕量 GUI
* **[Ride The Lightning (RTL)](https://github.com/Ride-The-Lightning/RTL)** - 網頁版節點管理界面

### 託管錢包（便利但需信任）

* **[Wallet of Satoshi](https://www.walletofsatoshi.com/)** - 簡單易用的託管錢包
* **[Alby](https://getalby.com/)** - 瀏覽器擴充功能錢包

---

## 節點管理工具

### 管理界面

* **[Ride The Lightning (RTL)](https://github.com/Ride-The-Lightning/RTL)** - 功能完整的網頁界面，支援 LND、CLN、Eclair
* **[ThunderHub](https://thunderhub.io/)** - 現代化的 LND 管理界面
* **[Lightning Terminal](https://lightning.engineering/terminal)** - Lightning Labs 官方管理工具
* **[Clams](https://clams.tech/)** - CLN 的現代化界面

### 流動性管理

* **[Lightning Loop](https://lightning.engineering/loop/)** - 鏈上/鏈下資金轉換
* **[Lightning Pool](https://lightning.engineering/pool/)** - 通道流動性市場
* **[Amboss Magma](https://amboss.space/magma)** - 流動性市場
* **[LN+](https://lightningnetwork.plus/)** - 通道交換平台

### 監控工具

* **[lndmon](https://github.com/lightninglabs/lndmon)** - LND 監控工具
* **[Torq](https://github.com/lncapital/torq)** - 節點管理和分析平台

---

## 區塊瀏覽器

### 網路瀏覽器

* **[mempool.space/lightning](https://mempool.space/lightning)** - 開源閃電網路瀏覽器
* **[1ML](https://1ml.com/)** - 節點和通道統計
* **[Amboss](https://amboss.space/)** - 節點評分和網路分析
* **[LN Router](https://lnrouter.app/)** - 路由分析工具

### 網路視覺化

* **[ACINQ Explorer](https://explorer.acinq.co/)** - 閃電網路拓撲視覺化
* **[LN Map](https://lnmap.org/)** - 3D 網路視覺化
* **[Cheese Robot](https://cheeserobot.org/)** - 節點排名和統計

---

## 開發資源

### SDK 與函式庫

* **[Lightning Dev Kit (LDK)](https://lightningdevkit.org/)** - Rust 閃電網路函式庫
* **[Breez SDK](https://breez.technology/sdk/)** - 整合 LSP 的開發套件
* **[lnbits](https://lnbits.com/)** - 輕量級錢包系統和 API
* **[BTCPay Server](https://btcpayserver.org/)** - 開源支付處理器

### API 與服務

* **[LND gRPC API](https://api.lightning.community/)** - LND API 文檔
* **[CLN REST API](https://docs.corelightning.org/reference/get-started)** - Core Lightning API
* **[Voltage API](https://docs.voltage.cloud/)** - 托管節點 API

### 測試環境

* **[Polar](https://lightningpolar.com/)** - 一鍵建立本地測試網路
* **[Signet](https://mempool.space/signet)** - 受控測試網路（含閃電網路）
* **[Scaling Lightning](https://github.com/scaling-lightning/scaling-lightning)** - 大規模測試工具

---

## 學習資源

### 技術文檔

* **[BOLT 規範](https://github.com/lightning/bolts)** - 閃電網路協議規範
* **[LND 開發者文檔](https://docs.lightning.engineering/)** - Lightning Labs 官方文檔
* **[Mastering the Lightning Network](https://github.com/lnbook/lnbook)** - 開源技術書籍（Andreas Antonopoulos 等著）

### 論文

* **[The Bitcoin Lightning Network Paper](https://lightning.network/lightning-network-paper.pdf)** - 原始白皮書
* **[閃電網路白皮書（簡中翻譯）](https://github.com/ChenPoWei/bitcoincn/blob/master/%E6%AF%94%E7%89%B9%E5%B8%81%E9%97%AA%E7%94%B5%E7%BD%91%E7%BB%9C%E7%99%BD%E7%9A%AE%E4%B9%A6.pdf)**

### 教程

* **[Builder's Guide to the Lightning Network](https://docs.lightning.engineering/the-lightning-network/overview)** - Lightning Labs 開發者指南
* **[Learning Bitcoin from the Command Line - LN](https://github.com/BlockchainCommons/Learning-Bitcoin-from-the-Command-Line/blob/master/18_0_Understanding_Your_Lightning_Setup.md)** - 命令行教程

### 社群

* **[Lightning Dev Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/lightning-dev)** - 開發者郵件列表
* **[r/lightningnetwork](https://www.reddit.com/r/lightningnetwork/)** - Reddit 社群
* **[Lightning Network+ Telegram](https://t.me/LightningNetworkPlus)** - Telegram 群組

---

## 應用生態

### 支付與商務

* **[BTCPay Server](https://btcpayserver.org/)** - 開源支付處理器
* **[Zaprite](https://zaprite.com/)** - 商業支付解決方案
* **[Strike](https://strike.me/)** - 全球支付應用

### 社交與內容

* **[Nostr + Lightning](https://github.com/nostr-protocol/nostr)** - 去中心化社交網路整合 Zaps
* **[Stacker News](https://stacker.news/)** - 比特幣版 Hacker News
* **[Fountain](https://fountain.fm/)** - Podcast 應用，支援閃電打賞

### 遊戲與娛樂

* **[THNDR Games](https://www.thndr.games/)** - 閃電網路遊戲平台
* **[Zebedee](https://zebedee.io/)** - 遊戲整合 SDK

### 市場

* **[RoboSats](https://learn.robosats.com/)** - P2P 比特幣交易
* **[Bitrefill](https://www.bitrefill.com/)** - 閃電網路購買禮品卡
