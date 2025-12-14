---
title: 自託管工具資源
subtitle: Self-Custody Tools & Resources
layout: page
hero_image: /img/hero.png
show_sidebar: true
hero_height: 0
---

> 最後更新：2025年

---

## 目錄

- [為什麼要自託管](#為什麼要自託管)
- [硬體錢包](#硬體錢包)
- [軟體錢包](#軟體錢包)
- [全節點](#全節點)
- [閃電網路節點](#閃電網路節點)
- [備份方案](#備份方案)
- [多簽方案](#多簽方案)
- [安全最佳實踐](#安全最佳實踐)

---

## 為什麼要自託管

> "Not your keys, not your coins."
> — 比特幣社區格言

### 託管風險

| 風險類型 | 說明 | 歷史案例 |
|----------|------|---------|
| **交易所倒閉** | 交易所破產或詐騙 | Mt. Gox, FTX |
| **帳戶凍結** | 政府或平台凍結資產 | 多起案例 |
| **駭客攻擊** | 中心化服務被攻破 | Bitfinex, Binance |
| **監管風險** | 法規變更導致無法提款 | 各國案例 |

### 自託管優勢

- **真正擁有** - 只有你能移動你的比特幣
- **隱私保護** - 不需要 KYC 或身份驗證
- **抗審查** - 無人能阻止你的交易
- **無對手風險** - 不依賴第三方

---

## 硬體錢包

硬體錢包將私鑰存儲在專用安全晶片中，是自託管的最佳選擇。

### 主流硬體錢包

| 產品 | 特點 | 價格範圍 | 開源程度 |
|------|------|---------|---------|
| **[Coldcard](https://coldcard.com/)** | 純比特幣、氣隙操作、PSBT | $150+ | 部分開源 |
| **[Trezor](https://trezor.io/)** | 開源先驅、多幣種 | $70-250 | 完全開源 |
| **[Ledger](https://www.ledger.com/)** | 安全晶片、多幣種 | $80-180 | 部分開源 |
| **[BitBox02](https://shiftcrypto.ch/)** | 瑞士製造、簡潔設計 | $150 | 完全開源 |
| **[Jade](https://blockstream.com/jade/)** | Blockstream 出品、可 DIY | $65 | 完全開源 |
| **[Passport](https://foundationdevices.com/)** | 氣隙操作、開源 | $200+ | 完全開源 |

### 選擇建議

**入門者推薦**: Trezor Model One 或 Jade
- 價格親民
- 開源可審計
- 社區支援完善

**進階用戶推薦**: Coldcard 或 Passport
- 氣隙操作（不連接電腦）
- 純比特幣專注
- 進階安全功能

### 氣隙操作 (Air-Gapped)

最安全的操作方式是讓硬體錢包永不連接任何電腦：

1. **MicroSD 卡** - 用於傳輸 PSBT
2. **QR Code** - 掃描交易數據
3. **NFC** - 近場通訊傳輸

---

## 軟體錢包

### 桌面錢包

* **[Sparrow Wallet](https://sparrowwallet.com/)** - 功能最完整的比特幣桌面錢包
  - UTXO 管理
  - CoinJoin 支援
  - 硬體錢包整合
  - 多簽支援
  - **推薦度**: ★★★★★

* **[Specter Desktop](https://specter.solutions/)** - 多簽專家
  - 專注多簽設定
  - 硬體錢包協調器
  - Bitcoin Core 整合
  - **推薦度**: ★★★★☆

* **[Bitcoin Core](https://bitcoincore.org/)** - 官方全節點錢包
  - 最去中心化
  - 完整驗證
  - 開發者首選
  - **推薦度**: ★★★★☆

### 行動錢包

| 錢包 | 平台 | 特點 | 推薦度 |
|------|------|------|--------|
| **[Blue Wallet](https://bluewallet.io/)** | iOS/Android | 功能豐富、LN 支援 | ★★★★☆ |
| **[Nunchuk](https://nunchuk.io/)** | iOS/Android | 多簽專注 | ★★★★★ |
| **[Green Wallet](https://blockstream.com/green/)** | iOS/Android | Blockstream 出品 | ★★★★☆ |
| **[Muun](https://muun.com/)** | iOS/Android | 簡潔設計、LN 整合 | ★★★☆☆ |

### 進階軟體

* **[Bitcoin Keeper](https://bitcoinkeeper.app/)** - 移動端多簽
* **[Liana](https://wizardsardine.com/liana/)** - 時間鎖恢復機制
* **[Electrum](https://electrum.org/)** - 輕量級老牌錢包

---

## 全節點

運行自己的全節點是最高級別的自主權。

### 一體化節點方案

| 方案 | 難度 | 硬體需求 | 特點 |
|------|------|---------|------|
| **[Umbrel](https://umbrel.com/)** | 低 | Raspberry Pi / PC | 應用商店、美觀介面 |
| **[Start9](https://start9.com/)** | 低 | 專用硬體 / PC | 企業級可靠性 |
| **[RaspiBlitz](https://raspiblitz.org/)** | 中 | Raspberry Pi | DIY 友好 |
| **[MyNode](https://mynodebtc.com/)** | 中 | Raspberry Pi / PC | 免費/付費版 |
| **[Citadel](https://runcitadel.space/)** | 低 | Raspberry Pi | Umbrel 分支 |

### 手動安裝

* **[Bitcoin Core](https://bitcoincore.org/en/download/)** - 官方實現
* **[Bitcoin Knots](https://bitcoinknots.org/)** - 增強版 Core
* **[btcd](https://github.com/btcsuite/btcd)** - Go 語言實現
* **[libbitcoin](https://libbitcoin.info/)** - C++ 獨立實現

### 硬體需求

**最低需求**:
- 4GB RAM
- 1TB SSD（區塊鏈目前約 550GB）
- 穩定網路連接

**推薦配置**:
- 8GB+ RAM
- 2TB NVMe SSD
- 有線網路連接

---

## 閃電網路節點

### 節點實現

| 實現 | 語言 | 特點 |
|------|------|------|
| **[LND](https://github.com/lightningnetwork/lnd)** | Go | 最流行、功能豐富 |
| **[Core Lightning](https://github.com/ElementsProject/lightning)** | C | 輕量、插件系統 |
| **[Eclair](https://github.com/ACINQ/eclair)** | Scala | Phoenix 錢包後端 |
| **[LDK](https://lightningdevkit.org/)** | Rust | 嵌入式解決方案 |

### 節點管理介面

* **[ThunderHub](https://thunderhub.io/)** - 現代化管理介面
* **[Ride the Lightning](https://github.com/Ride-The-Lightning/RTL)** - 功能全面
* **[Lightning Terminal](https://lightning.engineering/terminal/)** - Lightning Labs 官方
* **[Zeus](https://zeusln.app/)** - 移動端遠端控制

### 流動性管理

* **[Amboss](https://amboss.space/)** - 節點監控和分析
* **[1ML](https://1ml.com/)** - 閃電網路探索器
* **[Lightning Pool](https://lightning.engineering/pool/)** - 流動性市場

---

## 備份方案

### 助記詞備份

#### 材質選擇

| 材質 | 耐久性 | 成本 | 推薦度 |
|------|--------|------|--------|
| **鋼板/鈦板** | 耐火、耐水 | $50-200 | ★★★★★ |
| **紙張** | 脆弱 | $0 | ★★☆☆☆ |
| **記憶** | 可能遺忘 | $0 | ★★☆☆☆ |

#### 金屬備份產品

* **[Cryptosteel](https://cryptosteel.com/)** - 字母拼接
* **[Billfodl](https://privacypros.io/billfodl/)** - 磁吸字母
* **[SeedPlate](https://www.coinkite.com/seedplate)** - 衝壓鋼板
* **[Blockplate](https://www.blockplate.com/)** - 衝壓鋁板

### 備份策略

#### 3-2-1 原則
- **3** 份備份
- **2** 種不同介質
- **1** 份異地存放

#### Shamir 備份 (SLIP39)

將助記詞分成多份，需要特定數量才能恢復：

- **2-of-3** - 適合個人使用
- **3-of-5** - 適合高價值存儲
- **支援錢包**: Trezor, Electrum

#### 密碼保護

**BIP 39 Passphrase**:
- 在助記詞基礎上添加額外密碼
- 產生完全不同的錢包
- 提供額外安全層和合理否認性

---

## 多簽方案

多重簽名（Multisig）需要多個密鑰才能移動資金。

### 常見配置

| 配置 | 使用場景 | 優點 | 缺點 |
|------|---------|------|------|
| **2-of-3** | 個人存儲 | 平衡安全和便利 | 需要管理 3 個密鑰 |
| **3-of-5** | 企業/高價值 | 更高容錯 | 複雜度增加 |
| **2-of-2** | 協作控制 | 雙方同意 | 單點故障風險 |

### 多簽工具

* **[Sparrow Wallet](https://sparrowwallet.com/)** - 多簽設定簡單
* **[Nunchuk](https://nunchuk.io/)** - 移動端多簽
* **[Spectre](https://specter.solutions/)** - 多簽專業工具
* **[Unchained Capital](https://unchained.com/)** - 協作託管服務
* **[Casa](https://casa.io/)** - 多簽服務

### 設定建議

**個人推薦配置 (2-of-3)**:
1. 硬體錢包 A（家中）
2. 硬體錢包 B（異地）
3. 紙質備份（銀行保險箱）

---

## 安全最佳實踐

### 操作安全

| 項目 | 建議 |
|------|------|
| **購買渠道** | 只從官方渠道購買硬體錢包 |
| **驗證韌體** | 使用前驗證設備完整性 |
| **離線生成** | 在離線環境生成助記詞 |
| **分散存儲** | 備份存放在不同地點 |
| **定期測試** | 定期測試備份恢復 |

### 常見錯誤

1. **截圖助記詞** - 雲端同步會洩漏
2. **在線生成** - 可能被惡意軟體記錄
3. **單一備份** - 火災/水災會永久丟失
4. **忘記 Passphrase** - 無法恢復
5. **重用地址** - 降低隱私

### 繼承規劃

- 準備詳細的恢復指南
- 告知可信賴的人備份位置
- 考慮使用時間鎖方案
- 定期更新繼承計劃

### 推薦資源

* **[10x Security Bitcoin Guide](https://btcguide.github.io/)** - 詳盡安全指南
* **[Jameson Lopp's Resources](https://www.lopp.net/bitcoin-information.html)** - 比特幣資源大全
* **[Bitcoin Security Guide](https://bitcoinsecurity.guide/)** - 安全實踐

---

## 進階主題

### 冷儲存

完全離線的存儲方案：

* **氣隙硬體錢包** - Coldcard, Passport
* **紙錢包** - 完全離線生成（不推薦新手）
* **腦錢包** - 從密碼短語派生（高風險）

### 時間鎖

使用 `OP_CHECKLOCKTIMEVERIFY` 設定解鎖時間：

* **[Liana Wallet](https://wizardsardine.com/liana/)** - 時間鎖恢復
* **繼承方案** - 指定時間後允許備份密鑰存取

### Covenant

未來可能啟用的限制性交易功能：

* **OP_CTV** - 交易模板承諾
* **OP_VAULT** - 金庫功能

---

## 學習資源

* **[Bitcoin.org - Securing Your Wallet](https://bitcoin.org/en/secure-your-wallet)**
* **[River Learn - Bitcoin Security](https://river.com/learn/topics/security/)**
* **[Ministry of Nodes](https://www.ministryofnodes.com.au/)** - 節點教程
