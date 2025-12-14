---
title: 開發者工具箱
subtitle: Bitcoin Developer Tools & Resources
layout: page
hero_image: /img/hero.png
show_sidebar: true
hero_height: 0
---

> 最後更新：2025年

---

## 目錄

- [開發環境](#開發環境)
- [SDK 與函式庫](#sdk-與函式庫)
- [測試網與工具](#測試網與工具)
- [閃電網路開發](#閃電網路開發)
- [API 服務](#api-服務)
- [學習資源](#學習資源)

---

## 開發環境

### Bitcoin Core

官方參考實現，也是最重要的開發工具。

* **[Bitcoin Core](https://bitcoincore.org/)** - 官方下載
* **[Bitcoin Core GitHub](https://github.com/bitcoin/bitcoin)** - 原始碼
* **[Developer Documentation](https://developer.bitcoin.org/)** - 開發者文檔

**常用 RPC 命令：**

```bash
# 獲取區塊鏈資訊
bitcoin-cli getblockchaininfo

# 創建錢包
bitcoin-cli createwallet "devwallet"

# 獲取新地址
bitcoin-cli getnewaddress

# 發送交易
bitcoin-cli sendtoaddress <address> <amount>
```

### Regtest 模式

本地開發和測試的最佳環境：

```bash
# 啟動 regtest 節點
bitcoind -regtest -daemon

# 生成區塊（挖礦）
bitcoin-cli -regtest generatetoaddress 101 <your_address>

# 重置區塊鏈
rm -rf ~/.bitcoin/regtest
```

### Docker 環境

快速啟動開發環境：

```dockerfile
# docker-compose.yml
version: '3'
services:
  bitcoin:
    image: ruimarinho/bitcoin-core
    ports:
      - "18443:18443"
    command:
      -regtest
      -rpcuser=dev
      -rpcpassword=dev
      -rpcallowip=0.0.0.0/0
```

---

## SDK 與函式庫

### Rust 生態系統

Rust 是比特幣開發最熱門的語言之一。

#### rust-bitcoin
* **[rust-bitcoin](https://github.com/rust-bitcoin/rust-bitcoin)** - 核心庫
* **用途**：交易構建、簽名、解析

```rust
use bitcoin::{Address, Network, PublicKey};

let address = Address::p2wpkh(&public_key, Network::Bitcoin)?;
```

#### BDK (Bitcoin Dev Kit)
* **[BDK](https://bitcoindevkit.org/)** - 錢包開發工具
* **[BDK GitHub](https://github.com/bitcoindevkit/bdk)** - 原始碼
* **特點**：描述符錢包、PSBT 支援、多平台

```rust
use bdk::{Wallet, database::MemoryDatabase};
use bdk::wallet::AddressIndex;

let wallet = Wallet::new(
    "wpkh([fingerprint/84'/0'/0']xpub.../0/*)",
    Some("wpkh([fingerprint/84'/0'/0']xpub.../1/*)"),
    Network::Bitcoin,
    MemoryDatabase::default(),
)?;

let address = wallet.get_address(AddressIndex::New)?;
```

### JavaScript/TypeScript

#### bitcoinjs-lib
* **[bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)** - 最流行的 JS 庫

```javascript
const bitcoin = require('bitcoinjs-lib');

// 創建 Taproot 地址
const { address } = bitcoin.payments.p2tr({
  internalPubkey: internalPubkey,
  network: bitcoin.networks.bitcoin,
});
```

#### Noble 密碼學庫
* **[noble-secp256k1](https://github.com/paulmillr/noble-secp256k1)** - 純 JS 橢圓曲線
* **[noble-hashes](https://github.com/paulmillr/noble-hashes)** - 哈希函數

### Python

#### python-bitcoinlib
* **[python-bitcoinlib](https://github.com/petertodd/python-bitcoinlib)** - Peter Todd 維護

```python
from bitcoin import SelectParams
from bitcoin.wallet import CBitcoinAddress

SelectParams('mainnet')
addr = CBitcoinAddress('bc1q...')
```

#### BDK Python
* **[bdk-python](https://github.com/bitcoindevkit/bdk-python)** - BDK 的 Python 綁定

### Go

* **[btcd](https://github.com/btcsuite/btcd)** - Go 語言比特幣實現
* **[btcutil](https://github.com/btcsuite/btcutil)** - 工具庫

### Scala

* **[bitcoin-s](https://bitcoin-s.org/)** - Scala 比特幣庫
* **特點**：DLC、Taproot 支援完善

---

## 測試網與工具

### 公共測試網

| 網路 | 用途 | 水龍頭 |
|------|------|--------|
| **Testnet** | 公共測試 | [testnet-faucet.com](https://testnet-faucet.com/) |
| **Signet** | 更穩定的測試 | [signet.bc-2.jp](https://signet.bc-2.jp/) |
| **Regtest** | 本地開發 | 自己挖礦 |

### Polar

閃電網路本地開發的最佳工具。

* **[Polar](https://lightningpolar.com/)** - 下載
* **[GitHub](https://github.com/jamaljsr/polar)** - 原始碼

**功能：**
- 一鍵啟動 Bitcoin + LN 節點
- 視覺化網路拓撲
- 支援 LND、CLN、Eclair
- 自動開通道和注資

### Nigiri

Docker 化的比特幣開發環境。

* **[Nigiri](https://github.com/vulpemventures/nigiri)** - GitHub

```bash
# 安裝
curl https://getnigiri.vulpem.com | bash

# 啟動
nigiri start

# 停止
nigiri stop
```

### 區塊瀏覽器（本地）

* **[mempool](https://github.com/mempool/mempool)** - 可自建的區塊瀏覽器
* **[Esplora](https://github.com/Blockstream/esplora)** - Blockstream 瀏覽器

---

## 閃電網路開發

### LND

* **[LND](https://github.com/lightningnetwork/lnd)** - Lightning Labs 實現
* **[LND API Docs](https://api.lightning.community/)** - API 文檔

```bash
# gRPC 連接
lncli getinfo

# 創建發票
lncli addinvoice --amt 1000

# 支付發票
lncli payinvoice <payment_request>
```

### LDK (Lightning Dev Kit)

* **[LDK](https://lightningdevkit.org/)** - 嵌入式閃電網路庫
* **[LDK Node](https://github.com/lightningdevkit/ldk-node)** - 即用型節點

**特點：**
- 模組化設計
- 適合嵌入應用
- Rust 實現，多語言綁定

### Core Lightning (CLN)

* **[Core Lightning](https://github.com/ElementsProject/lightning)** - Blockstream 實現
* **[CLN Plugins](https://github.com/lightningd/plugins)** - 插件生態

### WebLN

瀏覽器閃電網路標準。

* **[WebLN](https://webln.dev/)** - 規範和工具
* **[Alby](https://getalby.com/)** - 支援 WebLN 的瀏覽器擴展

```javascript
// 請求支付
if (typeof window.webln !== 'undefined') {
  await window.webln.enable();
  const result = await window.webln.sendPayment(paymentRequest);
}
```

---

## API 服務

### 區塊鏈數據

| 服務 | 特點 | 免費額度 |
|------|------|---------|
| **[mempool.space API](https://mempool.space/docs/api)** | 開源、可自建 | 無限（自建） |
| **[Blockstream Esplora](https://github.com/Blockstream/esplora)** | 開源 | 無限（自建） |
| **[BlockCypher](https://www.blockcypher.com/)** | 商業服務 | 有限 |
| **[Blockchain.com API](https://www.blockchain.com/api)** | 商業服務 | 有限 |

### 閃電網路

* **[Lightning Terminal](https://terminal.lightning.engineering/)** - Lightning Labs
* **[Amboss API](https://amboss.space/api)** - 節點數據

### 價格數據

* **[CoinGecko API](https://www.coingecko.com/en/api)** - 免費價格數據
* **[Kraken API](https://docs.kraken.com/rest/)** - 交易所 API

---

## 學習資源

### 官方文檔

* **[Bitcoin Developer Guide](https://developer.bitcoin.org/devguide/)** - 官方開發者指南
* **[Learn me a Bitcoin](https://learnmeabitcoin.com/)** - 視覺化學習
* **[Bitcoin Optech](https://bitcoinops.org/)** - 技術週報

### 互動教程

* **[Chaincode Labs Seminars](https://chaincode.gitbook.io/seminars/)** - 進階研討會
* **[Bitcoin Dev Project](https://bitcoindevs.xyz/)** - 實作專案
* **[Base58 Workshops](https://base58.school/)** - 進階課程

### 書籍

| 書籍 | 難度 | 語言 |
|------|------|------|
| **Mastering Bitcoin** | 中高 | 多語言 |
| **Programming Bitcoin** | 高 | Python |
| **Grokking Bitcoin** | 入門 | 英文 |

### 影片

* **[Jimmy Song's PB Class](https://programmingblockchain.com/)** - Programming Bitcoin 課程
* **[Base58 YouTube](https://www.youtube.com/@base58btc)** - 技術教程

### 社群

* **[Delving Bitcoin](https://delvingbitcoin.org/)** - 技術討論論壇
* **[Bitcoin StackExchange](https://bitcoin.stackexchange.com/)** - Q&A
* **[Bitcoin Dev Mailing List](https://lists.linuxfoundation.org/mailman/listinfo/bitcoin-dev)** - 開發者郵件列表

---

## 開發最佳實踐

### 安全考量

1. **永遠不要在主網上測試新代碼**
2. **使用描述符錢包**（而非舊式 HD 錢包）
3. **PSBT 用於多方簽名**
4. **驗證所有輸入**

### 測試策略

```
單元測試 → 整合測試 → Regtest → Testnet/Signet → 主網
```

### 推薦工具鏈

| 用途 | 推薦工具 |
|------|---------|
| **錢包開發** | BDK |
| **交易分析** | rust-bitcoin |
| **閃電網路** | LDK |
| **本地測試** | Polar / Nigiri |
| **Web 整合** | bitcoinjs-lib |

---

## 進階主題

### Miniscript

結構化的比特幣腳本子集。

* **[Miniscript 規範](https://bitcoin.sipa.be/miniscript/)** - Pieter Wuille
* **[Policy to Miniscript](https://bitcoin.sipa.be/miniscript/)** - 編譯器

```
# Policy（人類可讀）
or(pk(A), and(pk(B), older(144)))

# Miniscript（機器優化）
or_d(pk(A), and_v(v:pk(B), older(144)))
```

### Output Descriptors

標準化的錢包描述格式。

```
# Native SegWit 單簽
wpkh([fingerprint/84'/0'/0']xpub.../0/*)

# Taproot
tr([fingerprint/86'/0'/0']xpub.../0/*)

# 2-of-3 多簽
wsh(sortedmulti(2,xpub1...,xpub2...,xpub3...))
```

### PSBT (BIP 174)

部分簽名比特幣交易的標準格式。

**工作流程：**
1. **Creator** - 創建交易框架
2. **Updater** - 添加 UTXO 資訊
3. **Signer** - 添加簽名
4. **Combiner** - 合併部分簽名
5. **Finalizer** - 完成交易
6. **Extractor** - 提取最終交易

---

## 快速開始模板

### Node.js 專案

```bash
mkdir btc-project && cd btc-project
npm init -y
npm install bitcoinjs-lib @noble/secp256k1
```

### Rust 專案

```bash
cargo new btc-project && cd btc-project
cargo add bitcoin bdk
```

### Python 專案

```bash
mkdir btc-project && cd btc-project
python -m venv venv
source venv/bin/activate
pip install python-bitcoinlib
```

---

## 資源索引

### GitHub 組織

* **[bitcoin](https://github.com/bitcoin)** - Bitcoin Core
* **[bitcoindevkit](https://github.com/bitcoindevkit)** - BDK
* **[rust-bitcoin](https://github.com/rust-bitcoin)** - Rust 生態
* **[lightningnetwork](https://github.com/lightningnetwork)** - LND
* **[ElementsProject](https://github.com/ElementsProject)** - Core Lightning

### 規範文檔

* **[BIPs](https://github.com/bitcoin/bips)** - 比特幣改進提案
* **[BOLTs](https://github.com/lightning/bolts)** - 閃電網路規範
* **[SLIPs](https://github.com/satoshilabs/slips)** - Trezor 相關標準
