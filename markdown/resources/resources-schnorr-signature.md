---
title: Schnorr 簽名與 Taproot 資源
subtitle: Schnorr Signature & Taproot Resources
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

- [Taproot 升級概述](#taproot-升級概述)
- [BIP 規範](#bip-規範)
- [Schnorr 簽名](#schnorr-簽名)
- [MuSig 多重簽名](#musig-多重簽名)
- [相關技術](#相關技術)
- [開發資源](#開發資源)
- [學習資源](#學習資源)

---

## Taproot 升級概述

Taproot 是比特幣自 SegWit 以來最重大的升級，於 **2021 年 11 月**（區塊高度 709,632）正式啟用。此升級包含三個 BIP，引入 Schnorr 簽名、MAST（Merklized Alternative Script Trees）和 Tapscript。

### 主要改進

| 特性 | 描述 |
|------|------|
| **Schnorr 簽名** | 取代 ECDSA，更高效的簽名方案 |
| **簽名聚合** | 多個簽名可聚合為單一簽名 |
| **隱私提升** | 複雜腳本看起來像普通支付 |
| **腳本彈性** | Tapscript 支援未來升級 |

### 採用狀態

* **[Taproot 採用追蹤](https://transactionfee.info/charts/taproot-adoption/)** - 即時採用統計
* **[Bitcoin Optech: Taproot](https://bitcoinops.org/en/topics/taproot/)** - 技術追蹤

---

## BIP 規範

### 核心 BIP

* **[BIP 340: Schnorr Signatures for secp256k1](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)**
  - 定義比特幣使用的 Schnorr 簽名格式
  - 64 字節簽名（比 ECDSA 的 71-72 字節更短）
  - 批量驗證支援

* **[BIP 341: Taproot](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki)**
  - 定義 Taproot 輸出格式（P2TR）
  - MAST 結構允許隱藏未執行的腳本分支
  - Key path 和 Script path 兩種花費方式

* **[BIP 342: Tapscript](https://github.com/bitcoin/bips/blob/master/bip-0342.mediawiki)**
  - 更新的腳本驗證規則
  - 新增 OP_CHECKSIGADD
  - 為未來升級預留空間

### 延伸閱讀

* **[Bitcoin Optech: Taproot 詳解](https://bitcoinops.org/en/newsletters/2019/05/14/#soft-fork-discussion)**
* **[River: What is Taproot?](https://river.com/learn/what-is-taproot/)**
* [比特幣下一次升級要包含的 Taproot 究竟是什麼](https://ethfans.org/posts/what-is-taproot-the-next-bitcoin-upgrade)

---

## Schnorr 簽名

### 基本概念

Schnorr 簽名是由 Claus Schnorr 於 1989 年發明的數位簽名方案。其專利於 2008 年到期，使得比特幣得以採用。

**優點：**
- 線性性：支援簽名聚合
- 更短的簽名（64 字節）
- 批量驗證更高效
- 數學上可證明安全

### 技術資源

* **[Schnorr Signatures: An Overview](https://github.com/WebOfTrustInfo/rwot1-sf/blob/master/topics-and-advance-readings/Schnorr-Signatures--An-Overview.md)** - 概述
* **[Bitcoin Q&A: Schnorr signatures and the privacy roadmap](https://www.youtube.com/watch?v=JeJzwZgxF50)** - Andreas Antonopoulos 講解
* **[Schnorr Signatures & The Inevitability of Privacy in Bitcoin](https://medium.com/digitalassetresearch/schnorr-signatures-the-inevitability-of-privacy-in-bitcoin-b2f45a1f7287)**

### 論文

* **[Schnorr Non-interactive Zero-Knowledge Proof (RFC 8235)](https://www.rfc-editor.org/rfc/rfc8235)** - NIZK 標準
* **[Efficient Identification and Signatures for Smart Cards](https://link.springer.com/chapter/10.1007/0-387-34805-0_22)** - 原始論文
* **[On the Exact Security of Schnorr-Type Signatures](https://eprint.iacr.org/2012/029.pdf)** - 安全性分析

---

## MuSig 多重簽名

### MuSig 協議演進

| 版本 | 特點 | 狀態 |
|------|------|------|
| **MuSig** | 三輪互動式簽名 | 已棄用 |
| **MuSig2** | 兩輪互動式簽名 | 推薦使用 |
| **MuSig-DN** | 確定性 nonce | 研究中 |

### 資源

* **[BIP 327: MuSig2](https://github.com/bitcoin/bips/blob/master/bip-0327.mediawiki)** - MuSig2 規範
* **[Bitcoin Optech: MuSig](https://bitcoinops.org/en/topics/musig/)** - 技術追蹤
* **[MuSig2 Paper](https://eprint.iacr.org/2020/1261)** - 學術論文
* **[Blockstream MuSig Demo](https://github.com/BlockstreamResearch/scriptless-scripts)**

### 應用場景

- 多重簽名錢包（n-of-n 看起來像單簽名）
- 閃電網路通道（2-of-2 多簽）
- 冷錢包共同託管

---

## 相關技術

### FROST（閾值簽名）

* **[FROST Paper](https://eprint.iacr.org/2020/852)** - Flexible Round-Optimized Schnorr Threshold Signatures
* **[Bitcoin Optech: FROST](https://bitcoinops.org/en/topics/frost/)** - 技術追蹤
* 支援 t-of-n 閾值簽名（任意 t 個參與者可簽名）

### Adaptor Signatures

* **[Bitcoin Optech: Adaptor Signatures](https://bitcoinops.org/en/topics/adaptor-signatures/)** - 技術概述
* 無腳本腳本（Scriptless Scripts）
* 跨鏈原子交換
* 閃電網路 PTLCs

### Cross-Input Signature Aggregation (CISA)

* **[CISA 提案](https://bitcoinops.org/en/topics/cross-input-signature-aggregation/)** - 跨輸入簽名聚合
* 進一步減少交易大小
* 需要軟分叉啟用

---

## 開發資源

### 函式庫

* **[libsecp256k1](https://github.com/bitcoin-core/secp256k1)** - Bitcoin Core 使用的橢圓曲線庫
  - 包含 Schnorr 模組
  - C 語言實現

* **[secp256k1-zkp](https://github.com/BlockstreamResearch/secp256k1-zkp)** - Blockstream 擴展版
  - MuSig2 實現
  - Adaptor Signatures

* **[rust-secp256k1](https://github.com/rust-bitcoin/rust-secp256k1)** - Rust 封裝

### 錢包支援

支援 Taproot (P2TR) 的錢包：

| 錢包 | 類型 | Taproot 支援 |
|------|------|-------------|
| Bitcoin Core | 全節點 | 完整支援 |
| Sparrow | 桌面 | 完整支援 |
| BlueWallet | 行動 | 接收支援 |
| Ledger | 硬體 | 完整支援 |
| Trezor | 硬體 | 完整支援 |

### 測試資源

* **[Signet](https://en.bitcoin.it/wiki/Signet)** - 測試網路
* **[Taproot 測試地址生成器](https://bitcoinops.org/en/tools/calc-size/)**

---

## 學習資源

### 技術文章

* **[Pieter Wuille's Taproot Workshop](https://github.com/bitcoinops/taproot-workshop)** - 官方工作坊
* **[Bitcoin Optech Taproot 準備指南](https://bitcoinops.org/en/preparing-for-taproot/)** - 系列文章
* **[Taproot Is Coming: What It Is, And How It Will Benefit Bitcoin](https://bitcoinmagazine.com/technical/taproot-coming-what-it-and-how-it-will-benefit-bitcoin)**

### 影片

* **[Bitcoin Q&A: Schnorr signatures](https://www.youtube.com/watch?v=JeJzwZgxF50)** - Andreas Antonopoulos
* **[Taproot Explained](https://www.youtube.com/watch?v=1gRCVLgkyAE)** - Stephan Livera Podcast

### 中文資源

* [Schnorr 簽名的前世今生：為什麼說比特幣的隱私性是不可避免的？](https://www.8btc.com/article/348517)
* [MuSig: 比特幣可用的 Schnorr 簽名方案](https://www.8btc.com/article/261281)
* [比特幣再迎重大技術突破，Schnorr 簽名程式碼正式開放測試](https://www.8btc.com/article/456123)

---

## 未來展望

### 正在討論的提案

* **[OP_CAT](https://bitcoinops.org/en/topics/op_cat/)** - 重新啟用字串連接
* **[OP_CTV (BIP 119)](https://github.com/bitcoin/bips/blob/master/bip-0119.mediawiki)** - CHECKTEMPLATEVERIFY
* **[SIGHASH_ANYPREVOUT](https://bitcoinops.org/en/topics/sighash_anyprevout/)** - 新的簽名哈希類型

### 潛在應用

- 更高效的 Vaults（金庫）
- 改進的 Covenants（限制條款）
- 更好的閃電網路通道
- 去中心化身份驗證
