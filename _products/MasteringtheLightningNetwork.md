---
title: Mastering the Lightning Network
subtitle: 精通閃電網路
description: 由 Andreas M. Antonopoulos 等人合著的閃電網路權威指南，深入解析比特幣第二層擴容方案的技術原理與實作。
product_code: L001
layout: product
image: /img/70.png
lang: zh
author: Andreas M. Antonopoulos, Olaoluwa Osuntokun, Rene Pickhardt
difficulty: 4
read_url: https://lnbook-zh.doge.tg/
---

## 關於本書

《Mastering the Lightning Network》是由三位閃電網路領域的頂尖專家共同撰寫的權威技術指南：

- **Andreas M. Antonopoulos** - 《Mastering Bitcoin》作者，區塊鏈教育先驅
- **Olaoluwa Osuntokun** - Lightning Labs CTO，LND 主要開發者
- **Rene Pickhardt** - 閃電網路研究員，路由演算法專家

本書深入探討閃電網路（Lightning Network）—— 一個建構在比特幣之上的第二層支付協議，能夠實現近乎即時、低成本的微支付交易。

---

## 為什麼需要閃電網路？

比特幣主鏈面臨的挑戰：

| 問題 | 主鏈限制 | 閃電網路解決方案 |
|------|----------|------------------|
| **交易速度** | 約 10 分鐘確認 | 毫秒級即時確認 |
| **交易容量** | 每秒 7 筆交易 | 理論上無限制 |
| **手續費** | 隨網路擁塞變動 | 極低（通常 < 1 sat） |
| **小額支付** | 不經濟 | 可支付 1 satoshi |
| **隱私性** | 鏈上公開可查 | 洋蔥路由加密 |

---

## 目錄概覽

### 第一部分：基礎概念

1. **Introduction** - 閃電網路簡介與動機
2. **Getting Started** - 開始使用閃電網路
3. **How the Lightning Network Works** - 閃電網路運作原理
4. **Lightning Node Software** - 節點軟體介紹（LND、c-lightning、Eclair）

### 第二部分：技術原理

5. **Operating a Lightning Network Node** - 運營閃電節點
6. **Lightning Network Architecture** - 網路架構
7. **Payment Channels** - 支付通道機制
8. **Routing on a Network of Payment Channels** - 路由機制
9. **Channel Operation and Payment Forwarding** - 通道操作與支付轉發
10. **Onion Routing** - 洋蔥路由

### 第三部分：進階主題

11. **Gossip and the Channel Graph** - Gossip 協議與通道圖
12. **Pathfinding and Payment Delivery** - 路徑尋找與支付交付
13. **Wire Protocol: Framing and Extensibility** - 線路協議
14. **Lightning's Encrypted Message Transport** - 加密訊息傳輸
15. **Lightning Payment Requests** - 支付請求（BOLT 11）
16. **Security and Privacy of the Lightning Network** - 安全與隱私

---

## 核心技術概念

### 支付通道 (Payment Channel)

```
┌─────────────────────────────────────────────────────────┐
│                    Funding Transaction                   │
│                    (2-of-2 Multisig)                    │
├─────────────────────────────────────────────────────────┤
│  Alice: 0.5 BTC                      Bob: 0.5 BTC       │
│         ←──────── 支付通道 ────────→                    │
│                                                          │
│  更新 #1: Alice 0.4 BTC ←→ Bob 0.6 BTC                 │
│  更新 #2: Alice 0.3 BTC ←→ Bob 0.7 BTC                 │
│  更新 #3: Alice 0.2 BTC ←→ Bob 0.8 BTC                 │
│                    ...                                   │
├─────────────────────────────────────────────────────────┤
│                   Closing Transaction                    │
│              (最終餘額結算上鏈)                          │
└─────────────────────────────────────────────────────────┘
```

### HTLC (哈希時間鎖合約)

閃電網路使用 HTLC 實現跨通道的原子支付：

- **Hash Lock** - 收款人提供 preimage 才能領取
- **Time Lock** - 超時後資金退回付款人
- **原子性** - 要麼完整成功，要麼完全失敗

### 洋蔥路由 (Onion Routing)

每個中間節點只知道：
- 上一跳是誰
- 下一跳是誰
- 不知道完整路徑

---

## 主流節點實現

| 實現 | 語言 | 開發團隊 | 特點 |
|------|------|----------|------|
| **LND** | Go | Lightning Labs | 最廣泛使用，API 完善 |
| **Core Lightning** | C | Blockstream | 輕量、模組化、插件系統 |
| **Eclair** | Scala | ACINQ | Phoenix 錢包後端 |
| **LDK** | Rust | Spiral | 嵌入式函式庫 |

---

## 適合讀者

- 想深入理解閃電網路技術的開發者
- 計劃運營閃電節點的人
- 對比特幣擴容方案感興趣的研究者
- 希望整合閃電支付的應用開發者

---

## 延伸資源

- **[BOLT 規範](https://github.com/lightning/bolts)** - 閃電網路技術規範
- **[Lightning Labs](https://lightning.engineering/)** - LND 開發團隊
- **[ACINQ](https://acinq.co/)** - Phoenix 錢包開發團隊
- **[1ML](https://1ml.com/)** - 閃電網路節點瀏覽器
- **[Amboss](https://amboss.space/)** - 閃電網路分析平台

---

## 書籍資訊

- **出版社**: O'Reilly Media
- **出版日期**: 2021 年 12 月
- **頁數**: 約 450 頁
- **授權**: CC BY-NC-ND 4.0（預計將改為 CC BY-SA）

> "閃電網路是比特幣成為全球支付網路的關鍵。這本書是理解其技術原理的最佳指南。"
