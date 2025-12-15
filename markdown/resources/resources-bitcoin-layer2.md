---
title: 比特幣 Layer 2 資源
subtitle: Bitcoin Layer 2 Resources
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

- [Layer 2 概述](#layer-2-概述)
- [閃電網路](#閃電網路)
- [BitVM](#bitvm)
- [RGB Protocol](#rgb-protocol)
- [Ark](#ark)
- [Liquid Network](#liquid-network)
- [側鏈與聯邦側鏈](#側鏈與聯邦側鏈)
- [Rollups](#rollups)
- [其他方案](#其他方案)

---

## Layer 2 概述

比特幣 Layer 2 是建立在比特幣區塊鏈之上的協議，旨在提升可擴展性、降低交易成本，並增加功能性，同時繼承比特幣的安全性。

### 為什麼需要 Layer 2

| 挑戰 | Layer 1 限制 | Layer 2 解決方案 |
|------|-------------|-----------------|
| 吞吐量 | ~7 TPS | 數百萬 TPS |
| 交易費用 | 高峰時期昂貴 | 接近零成本 |
| 確認時間 | ~10 分鐘 | 即時 |
| 智能合約 | 有限腳本能力 | 完整可編程性 |

### 設計取捨

不同 Layer 2 方案在以下維度有不同取捨：
- **安全性** - 繼承多少比特幣安全性
- **去中心化** - 需要信任多少方
- **功能性** - 支援什麼類型的應用
- **用戶體驗** - 進入/退出的複雜度

---

## 閃電網路

閃電網路是最成熟的比特幣 Layer 2，專注於支付場景。

> 詳細資源請參閱 [閃電網路資源頁面](/markdown/resources/resources-ln)

### 特點

- **即時支付** - 毫秒級確認
- **低費用** - 適合小額支付
- **隱私** - 支付路徑不上鏈
- **成熟生態** - 多年發展，廣泛採用

### 局限

- 需要流動性管理
- 收款需在線
- 不支援複雜智能合約

---

## BitVM

BitVM 是 Robin Linus 於 2023 年提出的突破性方案，將圖靈完備計算帶入比特幣。

### 核心概念

* **[BitVM 白皮書](https://bitvm.org/bitvm.pdf)** - 原始論文
* **[BitVM 官網](https://bitvm.org/)** - 專案主頁
* **[BitVM GitHub](https://github.com/BitVM/BitVM)** - 開源代碼

### 工作原理

1. **樂觀執行** - 假設所有計算都是誠實的
2. **欺詐證明** - 如有爭議，可在鏈上驗證
3. **無需分叉** - 使用現有比特幣腳本

### 應用場景

- **雙向橋接** - 信任最小化的跨鏈橋
- **Rollups** - 比特幣原生 Rollup
- **驗證系統** - 鏈上驗證任意計算

### 相關專案

* **[BitVM Bridge](https://www.bitvm.org/bridge)** - BitVM 橋接方案
* **[BitVM2](https://bitvm.org/bitvm2)** - 改進版本

---

## RGB Protocol

RGB 是客戶端驗證的智能合約系統，將狀態存儲在鏈下，只在比特幣上進行承諾。

### 資源

* **[RGB 官網](https://rgb.tech/)** - 專案主頁
* **[RGB 規範](https://github.com/RGB-WG/rgb)** - 協議規範
* **[RGB FAQ](https://rgbfaq.com/)** - 常見問題

### 核心特點

| 特性 | 說明 |
|------|------|
| **客戶端驗證** | 狀態由用戶驗證，不依賴全局共識 |
| **隱私** | 交易細節對網路不可見 |
| **可擴展** | 無需區塊鏈驗證所有交易 |
| **閃電整合** | 可在閃電網路上轉移 RGB 資產 |

### 應用

- **代幣發行** - 在比特幣上發行資產
- **NFT** - 獨特數字資產
- **智能合約** - 複雜業務邏輯
- **去中心化身份** - DID 系統

### 開發資源

* **[RGB Core](https://github.com/RGB-WG/rgb-core)** - 核心庫
* **[RGB Node](https://github.com/RGB-WG/rgb-node)** - 節點實現
* **[RGB SDK](https://github.com/RGB-Tools/rgb-lib)** - 開發工具

---

## Ark

Ark 是由前閃電網路開發者 Burak 提出的新型 Layer 2 協議。

### 資源

* **[Ark Protocol](https://ark-protocol.org/)** - 官方網站
* **[Ark 介紹](https://burakkeceli.medium.com/introducing-ark-6f87ae45e272)** - 原始介紹

### 特點

- **非交互式接收** - 收款無需在線
- **無通道** - 不需要管理支付通道
- **流動性共享** - 虛擬通道概念
- **隱私友好** - 更好的交易隱私

### 與閃電網路比較

| 特性 | 閃電網路 | Ark |
|------|---------|-----|
| 接收 | 需在線 | 可離線 |
| 通道管理 | 需要 | 不需要 |
| 流動性 | 個別管理 | 共享 |
| 成熟度 | 成熟 | 早期 |

---

## Liquid Network

Liquid 是由 Blockstream 開發的聯邦側鏈，專為交易所和機構設計。

### 資源

* **[Liquid Network](https://liquid.net/)** - 官方網站
* **[Blockstream Liquid](https://blockstream.com/liquid/)** - Blockstream 頁面
* **[Liquid 開發者文檔](https://docs.liquid.net/)** - 技術文檔

### 特點

- **快速確認** - 約 1 分鐘
- **機密交易** - 隱藏交易金額
- **資產發行** - 發行代幣化資產
- **聯邦託管** - 15 個聯邦成員

### 資產

- **L-BTC** - Liquid 上的比特幣
- **Tether (USDt)** - 穩定幣
- **各種代幣化資產**

### 工具

* **[Liquid Block Explorer](https://blockstream.info/liquid/)** - 區塊瀏覽器
* **[Aqua Wallet](https://aquawallet.io/)** - Liquid 錢包
* **[Marina Wallet](https://vulpem.com/marina)** - 瀏覽器擴展錢包

---

## 側鏈與聯邦側鏈

### 側鏈概念

側鏈是獨立的區塊鏈，通過雙向錨定與比特幣連接。

### 聯邦側鏈

* **[RSK (Rootstock)](https://rootstock.io/)** - EVM 相容智能合約平台
* **[Liquid Network](https://liquid.net/)** - 見上文
* **[Stacks](https://www.stacks.co/)** - 智能合約平台

### RSK 資源

* **[RSK 官網](https://rootstock.io/)** - 專案主頁
* **[RSK 文檔](https://developers.rsk.co/)** - 開發者文檔
* **[Powpeg](https://developers.rsk.co/rsk/architecture/powpeg/)** - 橋接機制

### Stacks

* **[Stacks](https://www.stacks.co/)** - 專案主頁
* **[Clarity 語言](https://clarity-lang.org/)** - 智能合約語言
* **[sBTC](https://www.stacks.co/sbtc)** - 去中心化比特幣錨定

---

## Rollups

### 比特幣 Rollups 概念

Rollups 將交易在鏈下執行，然後將壓縮的狀態承諾發布到比特幣。

### 類型

| 類型 | 驗證方式 | 特點 |
|------|---------|------|
| **Optimistic** | 欺詐證明 | 簡單，有挑戰期 |
| **ZK (Validity)** | 有效性證明 | 即時最終性，計算密集 |

### 專案

* **[Citrea](https://citrea.xyz/)** - ZK Rollup on Bitcoin
* **[Build on Bitcoin](https://www.buildonbitcoin.xyz/)** - Rollup 研究

### 挑戰

- 比特幣缺乏原生數據可用性層
- 需要 BitVM 或類似技術進行驗證
- 仍處於研究和開發階段

---

## 其他方案

### Statechains

* **[Statechains](https://bitcoinops.org/en/topics/statechains/)** - 鏈下 UTXO 轉移
* **[Mercury Wallet](https://mercurywallet.com/)** - Statechain 錢包

### Drivechains (BIP 300/301)

* **[Drivechains](https://www.drivechain.info/)** - 側鏈提案
* **[BIP 300](https://github.com/bitcoin/bips/blob/master/bip-0300.mediawiki)** - Hashrate Escrows
* **[LayerTwo Labs](https://www.layertwolabs.com/)** - Drivechain 開發

### Channel Factories

* **[Channel Factories](https://bitcoinops.org/en/topics/channel-factories/)** - 多方共享通道

### Fedimint

* **[Fedimint](https://fedimint.org/)** - 聯邦化託管
* 詳見 [隱私資源頁面](/markdown/resources/resources-blockchain-privacy)

---

## 開發資源

### 比較研究

* **[Bitcoin Layers](https://www.bitcoinlayers.org/)** - Layer 2 比較平台
* **[Bitcoin L2 Landscape](https://www.theblock.co/data/on-chain-metrics/bitcoin)** - 數據分析

### 學習資源

* **[Bitcoin Optech: Scaling](https://bitcoinops.org/en/topics/scalability/)** - 擴容技術
* **[What is a Bitcoin L2?](https://blog.lopp.net/what-is-a-bitcoin-layer-2/)** - Jameson Lopp 文章

### 社群

* **[Bitcoin Dev Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/bitcoin-dev)** - 開發者郵件列表
* **[Delving Bitcoin](https://delvingbitcoin.org/)** - 技術討論論壇

---

## 選擇指南

根據你的需求選擇合適的 Layer 2：

| 需求 | 推薦方案 |
|------|---------|
| 快速支付 | 閃電網路 |
| 代幣發行 | RGB, Liquid |
| 智能合約 | RSK, Stacks, RGB |
| 最大隱私 | RGB, Fedimint |
| 機構交易 | Liquid |
| 離線接收 | Ark（開發中） |

**注意：** 許多方案仍在積極開發中，在選擇時請評估其成熟度和安全性。
