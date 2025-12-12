---
title: BIP 精選導讀
subtitle: 重要比特幣改進提案解說
description: 精選最重要的 BIP（比特幣改進提案），提供中文導讀和背景說明，幫助理解比特幣協議演進。
product_code: T003
layout: product
image: /img/bip-guide.svg
lang: zh
author: Cypherpunks Taiwan
difficulty: 3
read_url: https://github.com/bitcoin/bips
---

## 什麼是 BIP？

**BIP**（Bitcoin Improvement Proposal，比特幣改進提案）是比特幣社群用於提出協議變更、新功能和最佳實踐的標準化文件格式。任何人都可以提交 BIP，但需要經過社群討論和審核。

BIP 分為三種類型：
- **Standards Track** - 影響比特幣實現的協議變更
- **Informational** - 提供資訊或指導方針
- **Process** - 描述流程或提出變更

---

## 錢包與密鑰管理

這些 BIP 定義了現代比特幣錢包的標準，幾乎所有錢包都實現了這些規範。

| BIP | 標題 | 說明 |
|-----|------|------|
| [BIP 32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) | **HD Wallets** | 階層式確定性錢包，從單一種子派生無限多個密鑰，是現代錢包的基礎 |
| [BIP 39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) | **Mnemonic Code** | 將種子轉換為 12/24 個助記詞，方便人類備份和記憶 |
| [BIP 43](https://github.com/bitcoin/bips/blob/master/bip-0043.mediawiki) | **Purpose Field** | 定義 HD 錢包路徑的第一層用途欄位，如 m/44'/... |
| [BIP 44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) | **Multi-Account** | 多幣種、多帳戶的 HD 錢包標準路徑 m/44'/0'/0' |
| [BIP 49](https://github.com/bitcoin/bips/blob/master/bip-0049.mediawiki) | **P2WPKH-nested-in-P2SH** | SegWit 相容地址的派生路徑 m/49'/0'/0'（3 開頭地址）|
| [BIP 84](https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki) | **Native SegWit** | 原生 SegWit 地址的派生路徑 m/84'/0'/0'（bc1q 開頭）|
| [BIP 86](https://github.com/bitcoin/bips/blob/master/bip-0086.mediawiki) | **Taproot Single Key** | Taproot 單簽地址的派生路徑 m/86'/0'/0'（bc1p 開頭）|

**建議閱讀順序**：BIP 32 → BIP 39 → BIP 44 → BIP 84 → BIP 86

---

## SegWit 隔離見證

2017 年啟用的重大升級，解決交易延展性問題並提升擴容能力。

| BIP | 標題 | 說明 |
|-----|------|------|
| [BIP 141](https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki) | **Segregated Witness** | SegWit 核心規範，將簽名數據移至見證區，修復交易延展性 |
| [BIP 143](https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki) | **Transaction Signature** | SegWit 交易的新簽名算法，防止二次哈希攻擊 |
| [BIP 144](https://github.com/bitcoin/bips/blob/master/bip-0144.mediawiki) | **Peer Services** | SegWit 的 P2P 網路協議擴展 |
| [BIP 173](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki) | **Bech32 Address** | bc1 開頭的原生 SegWit 地址編碼格式 |

---

## Taproot 升級

2021 年啟用的重大升級，引入 Schnorr 簽名和更強大的智能合約能力。

| BIP | 標題 | 說明 |
|-----|------|------|
| [BIP 340](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki) | **Schnorr Signatures** | 新的簽名算法，比 ECDSA 更高效，支持密鑰和簽名聚合 |
| [BIP 341](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki) | **Taproot** | 定義 Taproot 輸出結構，Key Path 和 Script Path 花費方式 |
| [BIP 342](https://github.com/bitcoin/bips/blob/master/bip-0342.mediawiki) | **Tapscript** | Taproot 下的腳本規則，新增操作碼如 OP_CHECKSIGADD |
| [BIP 350](https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki) | **Bech32m Address** | bc1p 開頭的 Taproot 地址編碼格式（修正 Bech32 缺陷）|

**為什麼重要**：Taproot 讓複雜的多簽和智能合約交易看起來像普通交易，提升隱私性和效率。

---

## 時間鎖與智能合約

這些操作碼讓比特幣支持基於時間的條件支付，是閃電網路的基礎。

| BIP | 標題 | 說明 |
|-----|------|------|
| [BIP 65](https://github.com/bitcoin/bips/blob/master/bip-0065.mediawiki) | **OP_CHECKLOCKTIMEVERIFY** | 絕對時間鎖，資金在指定區塊高度或時間前無法花費 |
| [BIP 68](https://github.com/bitcoin/bips/blob/master/bip-0068.mediawiki) | **Relative Lock-time** | 相對時間鎖，定義 nSequence 欄位的新語義 |
| [BIP 112](https://github.com/bitcoin/bips/blob/master/bip-0112.mediawiki) | **OP_CHECKSEQUENCEVERIFY** | 腳本層級的相對時間鎖操作碼 |
| [BIP 199](https://github.com/bitcoin/bips/blob/master/bip-0199.mediawiki) | **HTLC** | 哈希時間鎖合約標準，跨鏈原子交換和閃電網路的基礎 |

---

## 交易與費用

優化交易處理和費用管理的重要提案。

| BIP | 標題 | 說明 |
|-----|------|------|
| [BIP 125](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki) | **Replace-by-Fee (RBF)** | 允許用更高手續費替換未確認交易 |
| [BIP 174](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki) | **PSBT** | 部分簽名比特幣交易格式，支持多方協作簽名 |
| [BIP 370](https://github.com/bitcoin/bips/blob/master/bip-0370.mediawiki) | **PSBT Version 2** | PSBT 第二版，支持更靈活的交易構建 |
| [BIP 326](https://github.com/bitcoin/bips/blob/master/bip-0326.mediawiki) | **Anti-Fee-Sniping** | 防止礦工「偷取」高手續費交易的鎖定機制 |

---

## 網路與通訊

定義比特幣節點之間如何通訊。

| BIP | 標題 | 說明 |
|-----|------|------|
| [BIP 152](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki) | **Compact Block Relay** | 緊湊區塊傳輸，大幅減少區塊傳播的頻寬需求 |
| [BIP 155](https://github.com/bitcoin/bips/blob/master/bip-0155.mediawiki) | **addrv2** | 支持 Tor v3、I2P 等新型網路地址格式 |
| [BIP 157](https://github.com/bitcoin/bips/blob/master/bip-0157.mediawiki) | **Client Side Filtering** | 輕客戶端的新過濾機制，比 BIP 37 更隱私 |
| [BIP 158](https://github.com/bitcoin/bips/blob/master/bip-0158.mediawiki) | **Compact Block Filters** | 緊湊區塊過濾器的資料結構定義 |

---

## 輸出描述符與 Miniscript

現代錢包的進階功能。

| BIP | 標題 | 說明 |
|-----|------|------|
| [BIP 380](https://github.com/bitcoin/bips/blob/master/bip-0380.mediawiki) | **Output Descriptors** | 描述輸出腳本的標準語言，如 wpkh([fingerprint/path]xpub) |
| [BIP 381](https://github.com/bitcoin/bips/blob/master/bip-0381.mediawiki) | **Non-Segwit Descriptors** | 傳統地址的描述符：pk(), pkh(), sh() |
| [BIP 382](https://github.com/bitcoin/bips/blob/master/bip-0382.mediawiki) | **SegWit Descriptors** | SegWit 地址的描述符：wpkh(), wsh() |
| [BIP 386](https://github.com/bitcoin/bips/blob/master/bip-0386.mediawiki) | **Taproot Descriptors** | Taproot 地址的描述符：tr() |

---

## 推薦學習路徑

### 初學者
1. **BIP 39** - 理解助記詞如何運作
2. **BIP 32** - 理解 HD 錢包原理
3. **BIP 141** - 理解 SegWit 基本概念

### 開發者
1. **BIP 174 (PSBT)** - 現代錢包必備
2. **BIP 340/341/342** - Taproot 三部曲
3. **BIP 380 系列** - 輸出描述符

### 進階研究
1. 時間鎖系列 (BIP 65/68/112)
2. Schnorr/MuSig 相關論文
3. 閃電網路 BOLTs

---

## 延伸資源

- **[BIP 官方倉庫](https://github.com/bitcoin/bips)** - 所有 BIP 原文
- **[Bitcoin Optech](https://bitcoinops.org/en/topics/)** - 技術主題深入解說
- **[Learn Me a Bitcoin](https://learnmeabitcoin.com/)** - 視覺化學習
- **[Bitcoin Developer Guide](https://developer.bitcoin.org/)** - 官方開發文件
