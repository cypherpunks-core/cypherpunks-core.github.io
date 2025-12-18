---
title: 區塊鏈隱私資源
subtitle: Blockchain Privacy Resources
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
- [比特幣隱私基礎](#比特幣隱私基礎)
- [CoinJoin 技術](#coinjoin-技術)
- [Silent Payments](#silent-payments)
- [Payjoin](#payjoin)
- [聯邦化方案](#聯邦化方案)
- [零知識證明](#零知識證明)
- [其他隱私技術](#其他隱私技術)
- [隱私最佳實踐](#隱私最佳實踐)

---

## 2020-2024 重大進展

### Silent Payments (BIP 352)

* **[BIP 352: Silent Payments](https://github.com/bitcoin/bips/blob/master/bip-0352.mediawiki)** - 無需交互即可接收隱私支付
* **[Bitcoin Optech: Silent Payments](https://bitcoinops.org/en/topics/silent-payments/)** - 技術追蹤
* 解決地址重用問題，無需生成新地址

### Payjoin 發展 (BIP 78)

* **[BIP 78: Payjoin](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki)** - 打破常見啟發式分析
* **[Payjoin.org](https://payjoin.org/)** - 專案主頁
* **[Payjoin Dev Kit (PDK)](https://payjoindevkit.org/)** - 開發工具

### 聯邦化電子現金

* **[Fedimint](https://fedimint.org/)** - 聯邦化 Chaumian eCash
* **[Cashu](https://cashu.space/)** - 輕量級 eCash 協議
* 結合閃電網路實現隱私支付

### Taproot 隱私改進

* Taproot 讓複雜交易（多簽、時間鎖）看起來像普通交易
* MuSig2 實現更隱私的多簽
* PTLC 改善閃電網路支付隱私

---

## 比特幣隱私基礎

### 為什麼隱私重要

比特幣的透明性是其核心特性，但同時也帶來隱私挑戰。所有交易都是公開的，可被鏈上分析追蹤。

* **[Bitcoin Wiki: Privacy](https://en.bitcoin.it/wiki/Privacy)** - 全面的隱私指南
* **[Bitcoin Optech: Privacy](https://bitcoinops.org/en/topics/transaction-origin-privacy/)** - 技術概述
* **[比特幣問答：當比特幣可追溯時，我們如何保護隱私？](https://www.youtube.com/watch?v=PaNDHsix8cs)** - Andreas Antonopoulos

### 常見隱私問題

| 問題 | 說明 | 緩解方式 |
|------|------|---------|
| 地址重用 | 相同地址多次使用暴露關聯 | 每次使用新地址 |
| 找零輸出 | 找零回到同一錢包 | CoinJoin、Payjoin |
| 輸入聚合 | 多輸入暗示同一所有者 | 避免合併 UTXO |
| 金額分析 | 特定金額可被追蹤 | 混幣、等額輸出 |

---

## CoinJoin 技術

CoinJoin 由 Gregory Maxwell 於 2013 年提出，是目前最成熟的比特幣隱私技術。

### 實現

* **[Wasabi Wallet](https://wasabiwallet.io/)** - 自動 CoinJoin 桌面錢包
  - WabiSabi 協議（不等額 CoinJoin）
  - 去中心化協調

* **[JoinMarket](https://github.com/JoinMarket-Org/joinmarket-clientserver)** - 去中心化 CoinJoin 市場
  - 做市商/接受者模式
  - 無需信任第三方

* **[Whirlpool](https://samouraiwallet.com/whirlpool)** - Samourai Wallet 的 CoinJoin
  - 固定面額池
  - 免費重新混幣

### 技術資源

* **[CoinJoin：現實世界的比特幣隱私](https://bitcointalk.org/index.php?topic=279249.0)** - Gregory Maxwell 原始提案
* **[WabiSabi 論文](https://eprint.iacr.org/2021/206)** - Wasabi 2.0 協議

---

## Silent Payments

Silent Payments (BIP 352) 是比特幣隱私的重大突破，允許發送者生成一次性地址，接收者無需公開任何地址即可接收付款。

### 工作原理

1. 接收者公開一個「靜默支付地址」（不是傳統地址）
2. 發送者使用自己的私鑰和接收者的公鑰派生一次性地址
3. 只有接收者能偵測和花費這些資金

### 資源

* **[BIP 352](https://github.com/bitcoin/bips/blob/master/bip-0352.mediawiki)** - 規範
* **[Silent Payments 解說](https://bitcoinops.org/en/topics/silent-payments/)** - Bitcoin Optech
* **[silentpayments.xyz](https://silentpayments.xyz/)** - 教育資源

### 錢包支援

- Cake Wallet（進行中）
- Bitcoin Core（提案中）

---

## Payjoin

Payjoin (BIP 78) 通過讓發送者和接收者都提供輸入來打破交易分析的常見假設。

### 優點

- 打破「共同輸入所有權」假設
- 節省交易費用（合併 UTXO）
- 增加整體網路隱私

### 實現

* **[BTCPay Server](https://btcpayserver.org/)** - 支援 Payjoin 的支付處理器
* **[Payjoin Dev Kit](https://payjoindevkit.org/)** - Rust 開發庫
* **[Sparrow Wallet](https://sparrowwallet.com/)** - 支援 Payjoin

### 資源

* **[BIP 78](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki)** - 規範
* **[Payjoin 簡介](https://en.bitcoin.it/wiki/PayJoin)** - Bitcoin Wiki

---

## 聯邦化方案

### Fedimint

Fedimint 是聯邦化的 Chaumian eCash 系統，結合社區託管和閃電網路。

* **[Fedimint](https://fedimint.org/)** - 專案主頁
* **[Fedimint GitHub](https://github.com/fedimint/fedimint)** - 開源代碼
* **[Fedi](https://www.fedi.xyz/)** - 用戶端應用

**特點：**
- 社區託管（多方聯邦）
- 完美的交易隱私（Chaumian blinding）
- 閃電網路整合

### Cashu

輕量級 Chaumian eCash 協議，可在任何比特幣錢包上實現。

* **[Cashu](https://cashu.space/)** - 專案主頁
* **[Cashu 規範 (NUT)](https://github.com/cashubtc/nuts)** - 協議規範
* **[eNuts](https://www.enuts.cash/)** - 行動錢包

---

## 零知識證明

### ZK 在比特幣上的應用

* **[ZeroSync](https://zerosync.org/)** - 使用 STARK 證明的比特幣狀態證明
* **[BitVM](https://bitvm.org/)** - 比特幣上的通用計算

### 其他 ZK 資源

* **[什麼是零知識證明？](https://ethereum.org/en/zero-knowledge-proofs/)** - 概念介紹
* **[zkSNARKs vs zkSTARKs](https://consensys.net/blog/blockchain-explained/zero-knowledge-proofs-starks-vs-snarks/)** - 比較

---

## 其他隱私技術

### 網路層隱私

* **[Tor](https://www.torproject.org/)** - 匿名網路
* **[I2P](https://geti2p.net/)** - 隱形互聯網協議
* Bitcoin Core 支援 Tor 和 I2P

### Dandelion++ (BIP 156)

* **[Dandelion++](https://bitcoinops.org/en/topics/dandelion/)** - 交易傳播隱私
* 防止追蹤交易來源 IP

### 機密交易

* **[Confidential Transactions](https://elementsproject.org/features/confidential-transactions)** - 隱藏交易金額
* 目前在 Liquid 側鏈實現

### Bulletproofs

* **[Bulletproofs](https://eprint.iacr.org/2017/1066)** - 高效的範圍證明
* 用於驗證機密交易金額的有效性

---

## 隱私最佳實踐

### UTXO 管理

1. **避免地址重用** - 每次接收使用新地址
2. **標記 UTXO** - 追蹤資金來源
3. **謹慎合併** - 避免將不同來源的 UTXO 混合
4. **考慮時間因素** - 避免可預測的交易模式

### 錢包選擇

| 錢包 | 隱私功能 | 平台 |
|------|---------|------|
| Sparrow | CoinJoin, Payjoin, 完整 UTXO 控制 | 桌面 |
| Wasabi | 自動 CoinJoin | 桌面 |
| Samourai | Whirlpool, Ricochet | Android |
| Blue Wallet | Tor 支援 | iOS/Android |

### 節點配置

* 運行自己的全節點
* 通過 Tor 連接
* 使用 Electrum 私人服務器

### 推薦資源

* **[Bitcoin Privacy Guide](https://bitcoinprivacy.guide/)** - 完整隱私指南
* **[We Use Coins Privacy](https://www.weusecoins.com/bitcoin-privacy/)** - 入門指南
* **[6102bitcoin/CoinJoin-Research](https://github.com/6102bitcoin/CoinJoin-Research)** - CoinJoin 研究

---

## 隱私幣比較

雖然本頁專注於比特幣隱私，以下是其他隱私幣的參考：

| 幣種 | 技術 | 隱私模式 |
|------|------|---------|
| Monero (XMR) | Ring Signatures, RingCT | 預設隱私 |
| Zcash (ZEC) | zk-SNARKs | 可選隱私 |
| Grin | MimbleWimble | 預設隱私 |

**注意：** 許多比特幣隱私倡導者認為，在透明鏈上實現隱私比使用專門的隱私幣更有價值，因為它增加了所有比特幣用戶的匿名集。
