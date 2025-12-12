---
title: BIP 精選集
subtitle: Bitcoin Improvement Proposals Collection
description: 比特幣改進提案（BIP）是定義比特幣協議變更的標準化文件。本頁精選最重要的 BIP 並提供中文導讀。
product_code: R002
layout: product
image: /img/bip-collection.png
price: 繁中/Chinese
features:
    - label: 精選最重要的 BIP
      icon: fa-star
    - label: 中文導讀和解釋
      icon: fa-language
    - label: 按主題分類整理
      icon: fa-folder-open
rating: 4
hero_image: /img/hero.png
---

**[BIP GitHub 倉庫](https://github.com/bitcoin/bips)** | **[Bitcoin Wiki BIP](https://en.bitcoin.it/wiki/Bitcoin_Improvement_Proposals)**

# BIP 精選集

比特幣改進提案（Bitcoin Improvement Proposal, BIP）是比特幣社區用於提出協議變更、新功能和最佳實踐的標準化格式。

## BIP 分類

| 類型 | 說明 |
|------|------|
| **Standards Track** | 影響比特幣實現的變更 |
| **Informational** | 設計議題或通用指南 |
| **Process** | 比特幣流程相關的提案 |

---

## 基礎與錢包

### BIP 32 - HD Wallets
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)** | 分層確定性錢包

定義了從單一種子派生多個密鑰對的標準方法。這使得錢包備份只需要一個種子，就能恢復所有地址。

**關鍵概念：**
- 主密鑰和子密鑰
- 擴展公鑰和私鑰
- 派生路徑（如 m/44'/0'/0'/0/0）

### BIP 39 - 助記詞
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)** | Mnemonic Code for Generating Deterministic Keys

定義了 12-24 個單詞的助記詞標準，讓用戶更容易備份和恢復錢包。

**範例：**
```
abandon abandon abandon abandon abandon abandon
abandon abandon abandon abandon abandon about
```

### BIP 44 - 多帳戶 HD 錢包
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)** | Multi-Account Hierarchy

定義了派生路徑的標準結構：
```
m / purpose' / coin_type' / account' / change / address_index
```

### BIP 84 - Bech32 地址的 HD 錢包
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki)** | Derivation scheme for P2WPKH

定義了原生 SegWit 地址（bc1q...）的派生路徑。

---

## SegWit 升級

### BIP 141 - Segregated Witness
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki)** | 隔離見證

2017 年啟用的重大升級，將簽名數據從交易主體分離：
- 修復交易可塑性
- 增加有效區塊容量
- 為閃電網路鋪路

### BIP 143 - SegWit 簽名驗證
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0143.mediawiki)** | Transaction Signature Verification for Version 0 Witness Program

定義了 SegWit 交易的新簽名算法，更高效且安全。

### BIP 173 - Bech32 地址
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki)** | Base32 address format for native v0-16 witness outputs

定義了 `bc1q...` 格式的地址編碼標準：
- 全小寫，避免混淆
- 內建錯誤檢測
- 更高效的二維碼編碼

---

## Taproot 升級（2021）

### BIP 340 - Schnorr Signatures
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)** | Schnorr Signatures for secp256k1

引入 Schnorr 簽名方案：
- 更短的簽名（64 字節）
- 支援簽名聚合
- 批量驗證更高效

### BIP 341 - Taproot
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki)** | Taproot: SegWit version 1 spending rules

定義了 Taproot 輸出（bc1p...）的花費規則：
- Key path（直接簽名）
- Script path（腳本執行）
- MAST（默克爾化腳本樹）

### BIP 342 - Tapscript
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0342.mediawiki)** | Validation of Taproot Scripts

更新了 Script 語言以支援 Taproot：
- 新操作碼（OP_CHECKSIGADD）
- 移除操作碼限制
- 未來升級友好

### BIP 350 - Bech32m
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki)** | Bech32m format for v1+ witness addresses

Taproot 地址使用的改進編碼格式，修復了 Bech32 的一個邊緣情況。

---

## 交易與手續費

### BIP 125 - RBF
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0125.mediawiki)** | Opt-in Full Replace-by-Fee Signaling

允許用更高手續費替換未確認交易。

### BIP 174 - PSBT
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki)** | Partially Signed Bitcoin Transactions

部分簽名交易格式，用於：
- 多簽協作
- 硬體錢包
- CoinJoin

---

## 隱私增強

### BIP 78 - Payjoin
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki)** | A Simple Payjoin Proposal

發送者和接收者都提供輸入的協作交易，打破常見啟發式分析。

### BIP 352 - Silent Payments
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0352.mediawiki)** | Silent Payments

允許發送者為接收者生成一次性地址，無需交互。

---

## 多重簽名

### BIP 327 - MuSig2
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0327.mediawiki)** | MuSig2 for BIP340-compatible Multi-Signatures

兩輪的多方 Schnorr 簽名協議，產生單一簽名。

---

## 閃電網路相關

### BIP 118 - SIGHASH_ANYPREVOUT
**[規範](https://github.com/bitcoin/bips/blob/master/bip-0118.mediawiki)** | SIGHASH_ANYPREVOUT for Taproot Scripts

允許簽名不綁定特定輸入，用於 Eltoo 等閃電網路改進。

---

## 學習資源

- **[Learn me a Bitcoin - BIP](https://learnmeabitcoin.com/technical/bip/)** - 視覺化 BIP 解釋
- **[Bitcoin Optech Topics](https://bitcoinops.org/en/topics/)** - 技術主題深入
- **[Bitcoin Wiki](https://en.bitcoin.it/wiki/Bitcoin_Improvement_Proposals)** - BIP 列表

## 如何參與

1. 訂閱 [bitcoin-dev 郵件列表](https://lists.linuxfoundation.org/mailman/listinfo/bitcoin-dev)
2. 參與 [Delving Bitcoin](https://delvingbitcoin.org/) 討論
3. 閱讀 [BIP 提交指南](https://github.com/bitcoin/bips/blob/master/bip-0002.mediawiki)
