---
title: 比特幣與密碼學術語詞彙表
subtitle: Bitcoin & Cryptography Glossary
layout: page
hero_image: /img/hero.png
show_sidebar: true
hero_height: 0
---

> 最後更新：2025年

本頁面收錄比特幣、閃電網路及相關密碼學技術的專業術語，涵蓋 2020-2024 年的最新技術發展。

---

## 目錄

- [基礎概念](#基礎概念)
- [交易與腳本](#交易與腳本)
- [Taproot 與 Schnorr](#taproot-與-schnorr)
- [閃電網路](#閃電網路)
- [隱私技術](#隱私技術)
- [Layer 2 與擴展](#layer-2-與擴展)
- [密碼學](#密碼學)
- [共識與挖礦](#共識與挖礦)

---

## 基礎概念

### BIP（Bitcoin Improvement Proposal）
比特幣改進提案，用於提出比特幣協議變更的標準化文件格式。重要 BIP 包括：
- **BIP 32**：分層確定性錢包（HD Wallet）
- **BIP 39**：助記詞標準
- **BIP 141**：隔離見證（SegWit）
- **BIP 340-342**：Taproot 升級

### UTXO（Unspent Transaction Output）
未花費交易輸出。比特幣的基本記帳單位，每個 UTXO 代表一筆可以被花費的比特幣。

### 聰（Satoshi, sat）
比特幣的最小單位，1 BTC = 100,000,000 sats。以比特幣創造者中本聰命名。

### 區塊高度（Block Height）
區塊鏈中特定區塊的位置編號，從創世區塊（高度 0）開始計算。

### 確認（Confirmation）
交易被包含在區塊中後獲得的確認數。每增加一個新區塊，確認數加一。一般認為 6 個確認足夠安全。

### 全節點（Full Node）
完整驗證所有交易和區塊的比特幣節點，不信任任何第三方。

### SPV（Simplified Payment Verification）
簡化支付驗證，輕量級節點使用的驗證方式，只下載區塊頭而非完整區塊。

### Mempool
交易池，存儲已廣播但尚未被打包進區塊的交易。

---

## 交易與腳本

### SegWit（Segregated Witness）
隔離見證，2017 年啟用的升級，將簽名數據從交易主體分離，增加區塊容量並修復交易可塑性問題。

### 原生 SegWit（Native SegWit）
使用 bech32 地址格式（以 `bc1q` 開頭）的 SegWit 輸出，比包裹式 SegWit 更高效。

### Script
比特幣的腳本語言，用於定義花費條件。故意設計為非圖靈完備以確保安全。

### P2PKH（Pay-to-Public-Key-Hash）
傳統地址格式，以 `1` 開頭。

### P2SH（Pay-to-Script-Hash）
腳本哈希地址，以 `3` 開頭，支援多簽等複雜腳本。

### P2TR（Pay-to-Taproot）
Taproot 地址格式，以 `bc1p` 開頭，是 Taproot 升級引入的新輸出類型。

### P2WPKH / P2WSH
原生 SegWit 的公鑰哈希和腳本哈希輸出類型。

### 多重簽名（Multisig）
需要多個私鑰授權才能花費的交易類型，如 2-of-3 多簽。

### 時間鎖（Timelock）
限制交易在特定時間或區塊高度之前無法被確認的機制。包括 `nLockTime` 和 `OP_CHECKLOCKTIMEVERIFY`。

### RBF（Replace-by-Fee）
允許用更高手續費替換未確認交易的機制（BIP 125）。

### CPFP（Child-Pays-for-Parent）
通過子交易為父交易「加速」的技術，子交易附帶足夠高的手續費。

---

## Taproot 與 Schnorr

### Taproot
2021 年 11 月啟用的比特幣升級（BIP 341），結合 Schnorr 簽名和 MAST，提升隱私和效率。

### Schnorr 簽名
BIP 340 定義的簽名方案，相比 ECDSA：
- 更短的簽名（64 字節）
- 支援簽名聚合
- 批量驗證更高效

### MAST（Merklized Alternative Script Trees）
默克爾化替代腳本樹，允許只公開執行的腳本分支，隱藏其他分支。

### Tapscript
BIP 342 定義的 Taproot 腳本更新，支援未來升級。

### Key Path / Script Path
Taproot 的兩種花費方式：
- **Key Path**：直接用聚合公鑰簽名，最高效且隱私
- **Script Path**：揭示並執行特定腳本分支

### MuSig / MuSig2
多方 Schnorr 簽名協議，允許多個簽名者產生單一簽名：
- **MuSig**：三輪協議
- **MuSig2**：改進的兩輪協議（BIP 327）

### FROST
閾值 Schnorr 簽名方案，支援 t-of-n 簽名（任意 t 個參與者）。

### Adaptor Signature
適配器簽名，用於無腳本腳本（Scriptless Scripts）和跨鏈原子交換。

---

## 閃電網路

### 支付通道（Payment Channel）
兩方之間的鏈下交易通道，允許即時、低成本的交易。

### HTLC（Hash Time-Locked Contract）
哈希時間鎖合約，閃電網路路由的核心機制，使用哈希鎖和時間鎖確保支付安全。

### PTLC（Point Time-Locked Contract）
點時間鎖合約，使用 Adaptor Signatures 替代哈希鎖，提供更好的隱私。

### BOLT（Basis of Lightning Technology）
閃電網路互操作性規範，定義協議細節。

### Onion Routing
洋蔥路由，閃電網路用於隱藏支付路徑的技術。

### Invoice
閃電網路付款請求，包含金額、收款地址等信息。

### LNURL
閃電網路 URL 協議，簡化用戶交互（如 LNURL-pay、LNURL-withdraw）。

### Keysend
無需 invoice 的閃電網路支付方式。

### AMP（Atomic Multi-path Payments）
原子多路徑支付，將大額支付拆分為多條路徑。

### Splicing
在不關閉通道的情況下增減通道容量。

### Dual-Funded Channels
雙方同時注資的通道開設方式。

### LSP（Lightning Service Provider）
閃電網路服務提供者，為用戶提供流動性和通道管理服務。

### Watchtower
瞭望塔，監控通道並在對方嘗試欺詐時廣播懲罰交易。

### Anchor Outputs
錨定輸出，允許在廣播後調整承諾交易的手續費。

---

## 隱私技術

### CoinJoin
多個用戶將交易合併，打破交易圖分析。

### Payjoin（P2EP）
發送者和接收者都提供輸入的協作交易，打破常見啟發式分析（BIP 78）。

### Silent Payments
靜默支付（BIP 352），允許發送者為接收者生成一次性地址，無需交互。

### UTXO 管理
追蹤和管理未花費輸出，避免隱私洩漏的技術。

### 地址重用（Address Reuse）
多次使用同一地址接收付款，會降低隱私，應該避免。

### Chaumian eCash
盲簽名電子現金，由 David Chaum 發明，用於 Fedimint 和 Cashu。

### Fedimint
聯邦化的 Chaumian eCash 系統，結合社區託管和閃電網路。

### Cashu
輕量級 eCash 協議，可在任何閃電錢包上實現。

### Dandelion（BIP 156）
蒲公英協議，改變交易傳播方式以隱藏來源 IP。

### Tor / I2P
匿名網路協議，Bitcoin Core 原生支援。

---

## Layer 2 與擴展

### Layer 2
建立在比特幣基礎層之上的協議，提供更高的可擴展性。

### BitVM
將圖靈完備計算帶入比特幣的方案，使用樂觀執行和欺詐證明。

### RGB Protocol
客戶端驗證的智能合約系統，狀態存儲在鏈下。

### Ark
新型 Layer 2 協議，支援非交互式接收。

### Liquid Network
Blockstream 開發的聯邦側鏈，支援機密交易和快速確認。

### 側鏈（Sidechain）
獨立的區塊鏈，通過雙向錨定與比特幣連接。

### Rollup
將交易在鏈下執行，將壓縮的狀態承諾發布到主鏈的擴展方案。

### Statechain
允許在鏈下轉移 UTXO 所有權的方案。

### Drivechain（BIP 300/301）
允許創建側鏈的提案，使用 hashrate escrow。

### Ordinals
為每個聰（satoshi）賦予序號的協議，用於追蹤和轉移。

### Inscriptions
將數據永久刻錄到比特幣區塊鏈的技術，基於 Ordinals。

### BRC-20
基於 Ordinals 的代幣標準實驗。

### Runes
比特幣上的代幣協議，比 BRC-20 更高效。

---

## 密碼學

### 橢圓曲線密碼學（ECC）
比特幣使用的公鑰密碼系統，基於 secp256k1 曲線。

### ECDSA
橢圓曲線數位簽名算法，比特幣傳統使用的簽名方案。

### SHA-256
比特幣挖礦和交易 ID 使用的哈希函數。

### RIPEMD-160
與 SHA-256 一起用於生成比特幣地址的哈希函數。

### Hash160
SHA-256 後再 RIPEMD-160 的複合哈希。

### Merkle Tree
默克爾樹，用於高效驗證區塊中的交易。

### 零知識證明（Zero-Knowledge Proof）
證明某陳述為真，而不揭示任何其他信息。

### zkSNARK / zkSTARK
零知識證明的兩種實現方式。

### BLS 簽名
支援高效聚合的簽名方案，用於以太坊 2.0。

---

## 共識與挖礦

### 工作量證明（Proof of Work, PoW）
比特幣的共識機制，礦工通過計算尋找有效區塊哈希。

### 難度調整（Difficulty Adjustment）
每 2016 個區塊調整一次挖礦難度，維持約 10 分鐘的出塊時間。

### 減半（Halving）
約每 4 年區塊獎勵減半。2024 年第四次減半後獎勵為 3.125 BTC。

### 礦池（Mining Pool）
礦工合作挖礦並分享獎勵。

### Stratum V2
新一代礦池協議，改進去中心化和效率。

### ASIC
專用集成電路，專門設計用於比特幣挖礦。

### 區塊模板（Block Template）
礦工用於構建候選區塊的交易集。

### 孤塊（Orphan Block）
有效但未被納入主鏈的區塊。

### 軟分叉（Soft Fork）
向後兼容的協議升級，舊節點仍能驗證新區塊。

### 硬分叉（Hard Fork）
不向後兼容的協議變更，導致鏈分裂。

---

## 其他術語

### Nostr
去中心化社交協議，原生整合閃電網路。

### NIP（Nostr Implementation Possibilities）
Nostr 協議的實現可能性規範。

### Zap
Nostr 上的閃電網路打賞功能（NIP-57）。

### DLC（Discreet Log Contract）
離散對數合約，比特幣上的智能合約形式。

### Miniscript
比特幣腳本的結構化子集，簡化複雜腳本的構建。

### Descriptor
描述符，用於表示錢包如何派生地址的字符串格式。

### PSBT（Partially Signed Bitcoin Transaction）
部分簽名的比特幣交易（BIP 174），用於多方簽名協作。

### Output Descriptors
輸出描述符，標準化錢包備份和恢復格式。

---

## 參考資源

- **[Bitcoin Wiki](https://en.bitcoin.it/wiki/Main_Page)**
- **[Bitcoin Optech Topics](https://bitcoinops.org/en/topics/)**
- **[Learn me a Bitcoin](https://learnmeabitcoin.com/)**
- **[River Learn](https://river.com/learn/)**
