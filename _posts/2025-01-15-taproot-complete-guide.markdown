---
layout: post
title: 'Taproot 完整指南：從 Schnorr 簽名到實際應用'
date: 2025-01-15
categories:
- 技術教學
- bitcoin
- taproot
description: 深入解析比特幣 2021 年最重要的升級 Taproot，包括 Schnorr 簽名、MAST、Tapscript 的技術原理與實際應用。
image: /img/taproot-guide.svg
published: true
hero_image: /img/hero.png
tags:
- bitcoin
- taproot
- schnorr
- bip340
- bip341
- bip342
---

## 前言

2021 年 11 月 14 日，比特幣在區塊高度 709,632 啟用了 Taproot 升級。這是自 2017 年 SegWit 以來最重要的協議更新，由三個緊密相關的 BIP 組成：

- **BIP 340**: Schnorr Signatures for secp256k1
- **BIP 341**: Taproot: SegWit version 1 spending rules
- **BIP 342**: Validation of Taproot Scripts (Tapscript)

本文將深入解析這次升級的技術細節、帶來的改進，以及對比特幣生態系統的長期影響。

---

## 一、Schnorr 簽名 (BIP 340)

### 為什麼需要新的簽名方案？

比特幣原本使用 ECDSA（橢圓曲線數位簽名演算法）。雖然 ECDSA 已被證明安全，但 Schnorr 簽名方案具有幾個重要優勢：

| 特性 | ECDSA | Schnorr |
|------|-------|---------|
| 簽名大小 | 70-72 bytes | 64 bytes |
| 批量驗證 | 不支援 | 支援 |
| 簽名聚合 | 不支援 | 原生支援 |
| 數學證明 | 較複雜 | 更簡潔 |

### Schnorr 簽名原理

Schnorr 簽名基於離散對數問題的困難性。給定：
- 私鑰 `x`
- 公鑰 `P = x * G`（G 為生成點）
- 訊息 `m`

簽名過程：
1. 選擇隨機數 `k`，計算 `R = k * G`
2. 計算挑戰值 `e = H(R || P || m)`
3. 計算簽名 `s = k + e * x`
4. 簽名為 `(R, s)`

驗證過程：
- 檢查 `s * G == R + e * P`

### 簽名聚合的威力

Schnorr 簽名的線性特性允許多個簽名被聚合成單一簽名：

```
# 三個簽名者的公鑰
P1, P2, P3

# 聚合公鑰
P = P1 + P2 + P3

# 聚合簽名看起來與單一簽名完全相同
```

這意味著：
- **2-of-3 多簽**在鏈上看起來與**單簽**完全一樣
- **更低的手續費**（更小的交易體積）
- **更好的隱私**（無法區分多簽和單簽）

### MuSig2 協議

MuSig2 (BIP 327) 是實現多方 Schnorr 簽名的標準協議：

1. **密鑰聚合階段**：所有參與者的公鑰被聚合
2. **Nonce 交換**：兩輪通訊交換隨機數
3. **簽名生成**：每個參與者產生部分簽名
4. **簽名聚合**：部分簽名被合併為最終簽名

---

## 二、Taproot 輸出 (BIP 341)

### 新的地址格式

Taproot 引入了 SegWit v1 輸出，使用新的地址格式：

| 版本 | 地址前綴 | 範例 |
|------|---------|------|
| Legacy | 1... | 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2 |
| P2SH | 3... | 3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy |
| SegWit v0 | bc1q... | bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq |
| **Taproot** | **bc1p...** | **bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297** |

### 兩種花費路徑

Taproot 輸出可以通過兩種方式花費：

#### Key Path（密鑰路徑）

最簡單高效的方式，直接用聚合公鑰簽名：

```
witness: <signature>
scriptPubKey: OP_1 <32-byte-pubkey>
```

- 看起來像普通的單簽交易
- 最小的交易體積
- 最高的隱私性

#### Script Path（腳本路徑）

當需要使用複雜腳本條件時：

```
witness: <script-input> <script> <control-block>
```

- 只需揭示被執行的腳本
- 其他腳本分支保持隱藏
- 使用 Merkle 證明驗證

### MAST（默克爾化替代腳本樹）

MAST 允許將多個腳本條件組織成 Merkle 樹：

```
         Root
        /    \
      H1      H2
     /  \    /  \
   S1   S2  S3   S4
```

**優勢：**
- 只揭示使用的腳本分支
- 未使用的條件完全隱藏
- 支援大量複雜條件

**實際應用範例：**

假設一個資金需要滿足以下任一條件：
1. Alice 和 Bob 共同簽名（正常情況）
2. Alice 單獨簽名 + 1週時間鎖（Bob 失聯）
3. Bob 單獨簽名 + 1個月時間鎖（Alice 失聯）
4. 受託人簽名 + 6個月時間鎖（雙方失聯）

在 Taproot 之前，所有這些條件都必須公開。使用 MAST 後：
- 正常情況下使用 Key Path，看起來像普通交易
- 只有需要使用備用條件時才揭示該分支

---

## 三、Tapscript (BIP 342)

### 腳本語言更新

Tapscript 對比特幣腳本做了以下改進：

#### 新操作碼

**OP_CHECKSIGADD**：支援批量簽名驗證

```
# 舊的多簽方式（OP_CHECKMULTISIG）
OP_2 <pubkey1> <pubkey2> <pubkey3> OP_3 OP_CHECKMULTISIG

# 新的方式（更高效）
<pubkey1> OP_CHECKSIG
<pubkey2> OP_CHECKSIGADD
<pubkey3> OP_CHECKSIGADD
OP_2 OP_EQUAL
```

#### 移除的限制

- 移除了腳本大小限制（原本 10,000 bytes）
- 移除了操作碼數量限制（原本 201 個）
- 簽名必須非空（防止簽名可塑性）

#### 升級友好設計

Tapscript 使用 **OP_SUCCESS** 操作碼保留未來升級空間：

```
# 目前未定義的操作碼被視為 OP_SUCCESS
# 未來可以賦予新功能而不需硬分叉
```

---

## 四、實際應用場景

### 1. 更便宜的多簽

**傳統 2-of-3 多簽：**
- 輸入大小：約 297 bytes
- 所有公鑰都暴露

**Taproot 2-of-3：**
- Key Path 輸入大小：約 57 bytes（節省 80%+）
- 看起來與單簽完全相同

### 2. 閃電網路改進

#### 更隱私的通道

Taproot 使閃電網路通道在鏈上更難識別：
- 開通道交易看起來像普通交易
- 協作關閉也是普通交易
- 只有非協作關閉才會揭示腳本

#### PTLC（點時間鎖合約）

用 Adaptor Signatures 替代 HTLC：

| 特性 | HTLC | PTLC |
|------|------|------|
| 鏈接性 | 同一支付路徑可被關聯 | 每一跳都不同 |
| 鏈上足跡 | 暴露哈希值 | 普通簽名 |
| 隱私 | 較差 | 更好 |

### 3. DLC（離散對數合約）

Taproot 讓 DLC 更實用：
- 所有可能結果都隱藏在 MAST 中
- 正常結算看起來像普通交易
- 大幅降低鏈上足跡

### 4. Vault（金庫）

使用 Taproot 實現更安全的冷儲存：

```
Key Path: 延遲 + 冷錢包簽名
Script Path:
  - 分支1: 熱錢包 + 24小時延遲
  - 分支2: 恢復密鑰 + 1週延遲
```

---

## 五、開發者資源

### 錢包支援狀態（2025年）

| 錢包 | Taproot 支援 | 發送 | 接收 |
|------|-------------|------|------|
| Bitcoin Core | 完整 | ✅ | ✅ |
| Sparrow | 完整 | ✅ | ✅ |
| Blue Wallet | 部分 | ✅ | ✅ |
| Ledger | 完整 | ✅ | ✅ |
| Trezor | 完整 | ✅ | ✅ |
| Coldcard | 完整 | ✅ | ✅ |

### 開發工具

- **[bitcoin-s](https://bitcoin-s.org/)** - Scala 實現
- **[rust-bitcoin](https://github.com/rust-bitcoin/rust-bitcoin)** - Rust 實現
- **[bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)** - JavaScript 實現
- **[BDK](https://bitcoindevkit.org/)** - Bitcoin Dev Kit

### 學習資源

- **[BIP 340](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)** - Schnorr 規範
- **[BIP 341](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki)** - Taproot 規範
- **[BIP 342](https://github.com/bitcoin/bips/blob/master/bip-0342.mediawiki)** - Tapscript 規範
- **[Bitcoin Optech Taproot](https://bitcoinops.org/en/topics/taproot/)** - 技術追蹤

---

## 六、採用現況與未來展望

### 採用數據（2024年底）

根據鏈上數據：
- Taproot 輸出佔總 UTXO 約 5-8%
- 新交易中約 15-20% 使用 Taproot
- 主要交易所已支援存提款

### 未來發展

#### Cross-Input Signature Aggregation (CISA)

允許交易中所有輸入共享單一簽名：
- 進一步減少交易大小
- 更低的手續費
- 需要額外的軟分叉

#### OP_CAT 復活

如果啟用，可實現：
- 更靈活的 covenant
- 鏈上驗證能力增強
- 新的 Layer 2 可能性

---

## 結論

Taproot 是比特幣協議的重大進步，帶來了：

1. **更好的隱私** - 多簽和複雜腳本在鏈上不可區分
2. **更高的效率** - 更小的交易體積，更低的費用
3. **更強的可擴展性** - 為閃電網路和其他 Layer 2 提供更好的基礎
4. **更靈活的腳本** - MAST 和 Tapscript 開啟新的應用可能

隨著錢包和服務的持續採用，Taproot 的優勢將越來越明顯。建議所有比特幣用戶和開發者儘快遷移到 Taproot 地址。

---

## 參考資料

- [Bitcoin Optech: Preparing for Taproot](https://bitcoinops.org/en/preparing-for-taproot/)
- [Taproot Workshop](https://github.com/bitcoinops/taproot-workshop)
- [Pieter Wuille's Taproot Presentation](https://www.youtube.com/watch?v=KLNH0ttpdFg)
- [Jimmy Song: Taproot Explained](https://programmingblockchain.com/)
