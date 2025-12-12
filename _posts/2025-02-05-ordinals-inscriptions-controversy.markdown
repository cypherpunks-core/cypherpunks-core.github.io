---
layout: post
title: 'Ordinals 與 Inscriptions：爭議與技術實現'
date: 2025-02-05
categories:
- bitcoin
- ordinals
description: 深入解析 Ordinals 協議和 Inscriptions 的技術原理、生態發展，以及社區圍繞它們的爭議討論。
image: /img/ordinals.svg
published: true
hero_image: /img/hero.png
tags:
- bitcoin
- ordinals
- inscriptions
- nft
- brc20
---

## 前言

2023 年初，Casey Rodarmor 發布的 Ordinals 協議在比特幣社區引發了巨大爭議。這個允許在比特幣上「刻錄」任意數據的協議，讓 NFT 和代幣進入了比特幣生態系統，同時也引發了關於比特幣用途和區塊空間的激烈討論。

---

## 一、什麼是 Ordinals？

### 序數理論（Ordinal Theory）

Ordinals 的核心是為每一個聰（satoshi）賦予唯一的序號：

```
# 每個聰都有唯一的序數
第 0 聰：創世區塊的第一個聰
第 1 聰：創世區塊的第二個聰
...
第 2,099,999,997,690,000 聰：最後一個聰
```

### 序數追蹤規則

聰的序數根據「先進先出」(FIFO) 規則在交易間轉移：

```
輸入：
  - 100,000 sats (序數 1000-1099)
  - 50,000 sats (序數 2000-2049)

輸出：
  - 80,000 sats → 序數 1000-1079
  - 70,000 sats → 序數 1080-1099, 2000-2049
```

### 稀有度分類

基於區塊獎勵週期，聰被賦予不同稀有度：

| 稀有度 | 條件 | 數量 |
|--------|------|------|
| **Common** | 普通聰 | ~2.1 quadrillion |
| **Uncommon** | 每個區塊的第一個聰 | ~6,929,999 |
| **Rare** | 每個難度調整週期的第一個聰 | ~3,437 |
| **Epic** | 每次減半的第一個聰 | 32 |
| **Legendary** | 每個週期的第一個聰 | 5 |
| **Mythic** | 創世區塊的第一個聰 | 1 |

---

## 二、Inscriptions（銘文）

### 技術原理

Inscriptions 利用 Taproot 升級的特性，將任意數據「刻錄」到比特幣區塊鏈上：

```
# 數據存儲在 Tapscript 中
OP_FALSE
OP_IF
  OP_PUSH "ord"           # 協議標識
  OP_PUSH 1               # 內容類型標籤
  OP_PUSH "image/png"     # MIME 類型
  OP_PUSH 0               # 內容標籤
  OP_PUSH <image_data>    # 實際數據
OP_ENDIF
```

### 兩階段提交

Inscription 需要兩筆交易：

```
交易 1：Commit（承諾）
  - 創建包含 inscription 腳本的 Taproot 輸出
  - 數據被哈希隱藏

交易 2：Reveal（揭示）
  - 花費 commit 輸出
  - 揭示完整的 inscription 數據
  - 數據被永久記錄在區塊鏈上
```

### 為什麼使用 Taproot？

1. **Witness 折扣** - 見證數據只需支付 1/4 的費用
2. **大小限制放寬** - 單個腳本可達 ~400KB
3. **隱私特性** - Commit 階段不暴露內容

---

## 三、生態系統發展

### BRC-20 代幣標準

受 ERC-20 啟發的比特幣代幣標準：

```json
{
  "p": "brc-20",
  "op": "deploy",
  "tick": "ordi",
  "max": "21000000",
  "lim": "1000"
}
```

**操作類型：**
- `deploy` - 部署新代幣
- `mint` - 鑄造代幣
- `transfer` - 轉移代幣

**限制：**
- 依賴鏈下索引器
- 不是比特幣原生功能
- 需要信任索引服務

### Runes 協議

Casey Rodarmor 提出的改進方案，於 2024 年減半區塊啟動：

| 特性 | BRC-20 | Runes |
|------|--------|-------|
| 數據位置 | Inscription | OP_RETURN |
| UTXO 模型 | 違反 | 原生支援 |
| 效率 | 低 | 高 |
| 索引複雜度 | 高 | 中 |

### 市場與基礎設施

**交易市場：**
- **[Magic Eden](https://magiceden.io/ordinals)** - 主要市場
- **[OKX Ordinals](https://www.okx.com/web3/marketplace/ordinals)** - 交易所市場
- **[Unisat](https://unisat.io/)** - BRC-20 專注

**錢包支援：**
- **Xverse** - 專用 Ordinals 錢包
- **Unisat Wallet** - 瀏覽器擴展
- **Leather (Hiro)** - 多功能錢包

**索引器：**
- **[Ord](https://github.com/ordinals/ord)** - 官方索引器
- **[OPI](https://github.com/bestinslot-xyz/OPI)** - 開源索引器

---

## 四、社區爭議

### 支持方觀點

1. **創新和採用**
   > "Ordinals 為比特幣帶來了新用戶和新用例"

2. **費用收入**
   - 增加礦工手續費收入
   - 長期安全預算補充

3. **自由使用**
   - 比特幣是無需許可的
   - 用戶有權使用區塊空間

4. **文化層面**
   - 數位藝術和收藏品
   - 社區建設

### 反對方觀點

1. **偏離初衷**
   > "比特幣是點對點電子現金，不是圖片存儲"

2. **區塊空間擠占**
   - 推高普通交易手續費
   - 影響閃電網路通道操作

3. **節點負擔**
   - 區塊鏈膨脹
   - 全節點存儲成本增加

4. **垃圾交易**
   - 低價值數據永久存儲
   - 浪費稀缺資源

### 技術層面的討論

**是否應該阻止？**

```
觀點 A：不應該阻止
- 比特幣是中立的協議
- 審查違反去中心化精神
- 技術上難以有效阻止

觀點 B：應該限制
- 修改 Bitcoin Core 預設策略
- 提高 OP_RETURN 輸出數量
- 限制 witness 數據大小
```

**Bitcoin Core 的回應：**
- 維持中立立場
- 不主動限制
- 由市場和費用機制調節

---

## 五、對比特幣的影響

### 區塊空間使用

```
2022年（Ordinals 前）：
平均區塊大小：~1.5 MB
平均手續費：~$1-5

2023年（Ordinals 高峰）：
平均區塊大小：~2.5 MB
平均手續費：~$10-50（高峰期 $100+）
```

### 礦工收入結構

| 時期 | 區塊獎勵佔比 | 手續費佔比 |
|------|-------------|-----------|
| 2022 | ~98% | ~2% |
| 2023 (Ordinals) | ~85% | ~15% |
| 2024 減半區塊 | ~0% | ~100% |

### UTXO 集影響

Ordinals 創建了大量小額 UTXO：
- 單聰輸出（546 sats）
- UTXO 集膨脹
- 節點記憶體需求增加

---

## 六、技術深入

### Envelope 結構

完整的 inscription envelope：

```
OP_FALSE
OP_IF
  OP_PUSH "ord"                    # 協議標識符

  # 內容類型（可選）
  OP_PUSH 1
  OP_PUSH "text/plain;charset=utf-8"

  # 父 inscription（可選，用於集合）
  OP_PUSH 3
  OP_PUSH <parent_inscription_id>

  # 元數據（可選）
  OP_PUSH 5
  OP_PUSH <cbor_metadata>

  # 內容
  OP_PUSH 0
  OP_PUSH "Hello, Bitcoin!"
OP_ENDIF
```

### Inscription ID 格式

```
<txid>i<index>

例如：
6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0
```

### 遞歸 Inscriptions

引用其他 inscriptions 的能力：

```html
<!-- 在 HTML inscription 中引用另一個 inscription -->
<img src="/content/6fb976...i0">
```

**應用：**
- 共享資源庫
- 模組化 NFT
- 鏈上網站

---

## 七、替代方案比較

### RGB Protocol

| 特性 | Ordinals | RGB |
|------|----------|-----|
| 數據存儲 | 鏈上 | 鏈下 |
| 隱私 | 公開 | 保密 |
| 可擴展性 | 受限 | 高 |
| 智能合約 | 有限 | 完整 |

### Counterparty (XCP)

早期的比特幣資產協議：
- 2014 年啟動
- 使用 OP_RETURN
- 證明概念可行

### Stacks NFTs

- 獨立共識層
- 完整智能合約
- 不是純比特幣

---

## 八、未來展望

### 協議發展

1. **Runes 採用** - 更高效的代幣標準
2. **遞歸改進** - 更複雜的鏈上應用
3. **壓縮技術** - 減少數據佔用

### 市場趨勢

- 投機熱潮消退
- 藝術和文化項目沉澱
- 實用工具發展

### 技術演進

- 更好的索引解決方案
- 輕客戶端支援
- 跨鏈互操作性

---

## 九、實用指南

### 如何銘刻

**使用 ord 命令行：**

```bash
# 安裝 ord
cargo install ord

# 創建錢包
ord wallet create

# 銘刻文件
ord wallet inscribe --fee-rate 10 image.png
```

**使用 Web 服務：**
- [OrdinalsBot](https://ordinalsbot.com/)
- [Gamma.io](https://gamma.io/)

### 如何查看

- **[ordinals.com](https://ordinals.com/)** - 官方瀏覽器
- **[ord.io](https://www.ord.io/)** - 社區瀏覽器

### 安全注意事項

1. **備份錢包** - inscription 綁定到特定 UTXO
2. **不要花費** - 花費 inscription UTXO 會轉移所有權
3. **驗證索引** - 不同索引器可能有差異

---

## 結論

Ordinals 和 Inscriptions 是比特幣歷史上最具爭議性的發展之一：

**技術評價：**
- 巧妙利用 Taproot 特性
- 創造了新的使用場景
- 推動了費用市場發展

**社區分歧：**
- 是創新還是濫用？
- 自由市場還是需要治理？
- 短期炒作還是長期價值？

無論立場如何，Ordinals 已經成為比特幣生態系統不可忽視的一部分。它提醒我們，比特幣是一個開放的協議，其發展方向最終由用戶和市場決定。

---

## 參考資料

- [Ordinals 官方文檔](https://docs.ordinals.com/)
- [BIP: Ordinal Numbers](https://github.com/ordinals/ord/blob/master/bip.mediawiki)
- [Casey Rodarmor 的原始文章](https://rodarmor.com/blog/ordinal-theory/)
- [Bitcoin Optech: Inscriptions](https://bitcoinops.org/en/topics/inscriptions/)
