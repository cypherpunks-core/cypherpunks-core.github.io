---
title: Schnorr & Taproot 論文集
subtitle: 比特幣核心升級技術論文
description: 收錄 Schnorr 簽名、MuSig 多簽聚合、Taproot 升級等重要技術論文，是理解現代比特幣技術的必讀文獻。
product_code: P001
layout: product
image: /img/schnorr-taproot.svg
lang: en
author: Pieter Wuille et al.
difficulty: 5
read_url: https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
---

## 論文列表

### Schnorr 簽名
- **[BIP 340: Schnorr Signatures](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)** - Schnorr 簽名標準
- **[Simple Schnorr Multi-Signatures](https://eprint.iacr.org/2018/068.pdf)** - MuSig 原始論文

### Taproot 升級
- **[BIP 341: Taproot](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki)** - Taproot 輸出規範
- **[BIP 342: Tapscript](https://github.com/bitcoin/bips/blob/master/bip-0342.mediawiki)** - Tapscript 腳本規則

### 進階主題
- **[MuSig2](https://eprint.iacr.org/2020/1261.pdf)** - 改進的多簽協議
- **[FROST](https://eprint.iacr.org/2020/852.pdf)** - 門檻簽名方案

## 為什麼重要

這些論文定義了比特幣 2021 年 Taproot 升級的技術基礎：

- **Schnorr 簽名** - 比 ECDSA 更高效、支持簽名聚合
- **Taproot** - 提升隱私性和智能合約效率
- **MuSig** - 多簽交易看起來像普通交易

## 適合讀者

- 研究比特幣密碼學的人
- 想理解 Taproot 技術的開發者
- 密碼學和區塊鏈研究者
