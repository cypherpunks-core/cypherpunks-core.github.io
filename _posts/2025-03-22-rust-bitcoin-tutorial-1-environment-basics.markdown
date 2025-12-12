---
layout: post
title: "Rust Bitcoin 開發入門（一）：環境設置與基礎概念"
date: 2025-03-22
categories: [技術教學, Bitcoin, Rust]
tags: [Rust, Bitcoin, rust-bitcoin, 開發環境, 密碼學]
author: Cypherpunks Taiwan
math: true
---

這是 Rust Bitcoin 開發入門系列的第一篇。本系列將帶你從零開始使用 Rust 語言開發 Bitcoin 應用，從基礎設置到進階應用。

**系列文章導航：**
- **第一篇：環境設置與基礎概念**（本篇）
- [第二篇：地址生成與交易構建](/2025/03/23/rust-bitcoin-tutorial-2-addresses-transactions/)
- [第三篇：腳本與簽名](/2025/03/24/rust-bitcoin-tutorial-3-scripts-signatures/)
- [第四篇：進階應用與整合](/2025/03/25/rust-bitcoin-tutorial-4-advanced-applications/)

---

## 1. 為什麼選擇 Rust？

### 1.1 Rust 在 Bitcoin 開發中的優勢

當我們思考 Bitcoin 開發的語言選擇時，必須考慮這個領域的特殊需求。Bitcoin 是一個處理真實價值的系統，任何程式錯誤都可能導致不可逆的財務損失。與普通的網頁應用不同，Bitcoin 程式碼沒有「修復後重新部署」的奢侈——一旦交易廣播到網路並被確認，就永遠無法撤銷。

Rust 語言的設計理念與 Bitcoin 開發的需求高度契合。首先是記憶體安全。傳統的 C/C++ 程式經常遭受緩衝區溢位（buffer overflow）、使用後釋放（use-after-free）等漏洞的困擾。這些漏洞在金融軟體中可能是災難性的。Rust 的所有權系統在編譯時就能捕捉這些問題，而不是等到程式在生產環境中崩潰。

其次是執行緒安全。現代 Bitcoin 應用常常需要同時處理多個操作——監聽新區塊、處理用戶請求、簽署交易等。Rust 的借用檢查器能在編譯時防止資料競爭（data races），這意味著多執行緒程式的正確性有編譯器的保證。

效能方面，Rust 提供了「零成本抽象」。你可以使用高階的程式設計概念（泛型、迭代器、閉包等），而編譯器會將其優化成與手寫底層程式碼相當的機器碼。這對於需要處理大量密碼學運算的 Bitcoin 應用非常重要。

最後，Rust 沒有垃圾收集器（GC）。這意味著程式的執行時機是可預測的，不會突然暫停來回收記憶體。對於需要快速回應的交易簽署或區塊處理來說，這種可預測性是必要的。

### 1.2 Rust Bitcoin 生態系統

Rust 的 Bitcoin 生態系統已經相當成熟，形成了層次分明的函式庫架構。

在最底層，我們有 `bitcoin_hashes` 和 `secp256k1`。`bitcoin_hashes` 提供了 Bitcoin 使用的所有哈希函數——SHA256、RIPEMD160、HASH160 等。`secp256k1` 則是 Bitcoin 使用的橢圓曲線密碼學函式庫的 Rust 綁定，用於私鑰/公鑰運算和數位簽名。

在其上是 `rust-bitcoin`，這是核心的協議函式庫。它定義了 Bitcoin 的所有資料結構——交易、區塊、地址、腳本等——以及它們的序列化和解析邏輯。幾乎所有 Rust Bitcoin 專案都會依賴這個函式庫。

更高層次的函式庫建立在 `rust-bitcoin` 之上。BDK（Bitcoin Development Kit）是一個完整的錢包開發框架，處理了 UTXO 管理、交易構建、硬體錢包整合等複雜問題。LDK（Lightning Development Kit）則提供了 Lightning Network 的實現，讓開發者可以將閃電網路功能整合到自己的應用中。

這種分層架構的好處是，你可以根據需求選擇適當的抽象層次。需要完全控制？直接使用 `rust-bitcoin`。想要快速開發錢包？使用 BDK。

---

## 2. 環境設置

### 2.1 安裝 Rust

Rust 的安裝透過官方工具 `rustup` 進行，這是一個版本管理器，可以輕鬆切換 Rust 版本和安裝額外組件。

```bash
# 安裝 Rustup（Rust 版本管理器）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 按照提示完成安裝後，重新載入環境變數
source $HOME/.cargo/env

# 驗證安裝
rustc --version
cargo --version
```

安裝完成後，建議安裝兩個實用工具：`clippy` 是一個 lint 工具，能指出程式碼中的常見問題和改進建議；`rustfmt` 則自動格式化程式碼，保持風格一致。

```bash
rustup component add clippy
rustup component add rustfmt
```

### 2.2 創建專案

Rust 使用 Cargo 作為建構工具和套件管理器。創建新專案非常簡單：

```bash
cargo new bitcoin-tutorial
cd bitcoin-tutorial
```

這會創建一個標準的 Rust 專案結構。`Cargo.toml` 是專案的設定檔，定義了專案名稱、版本和依賴關係。`src/main.rs` 是主程式檔案。

### 2.3 配置依賴

在 `Cargo.toml` 中添加 Bitcoin 開發所需的依賴。每個依賴都有其特定用途：

```toml
[package]
name = "bitcoin-tutorial"
version = "0.1.0"
edition = "2021"

[dependencies]
# Bitcoin 核心庫 - 提供所有 Bitcoin 資料結構和協議邏輯
bitcoin = { version = "0.32", features = ["serde", "rand-std"] }

# 橢圓曲線密碼學 - 用於簽名和金鑰操作
secp256k1 = { version = "0.29", features = ["rand-std", "global-context"] }

# 序列化框架 - 用於 JSON 處理
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# 十六進制編碼 - Bitcoin 資料常用十六進制表示
hex = "0.4"

# 錯誤處理 - 簡化錯誤傳播
anyhow = "1.0"
thiserror = "1.0"

# BIP39 助記詞 - 人類可讀的種子格式
bip39 = "2.0"
```

`bitcoin` 函式庫的 `serde` feature 啟用了序列化支援，`rand-std` 則允許使用標準函式庫的隨機數生成器。`secp256k1` 的 `global-context` feature 提供了一個全域的上下文物件，避免在每次運算時都創建新的上下文。

---

## 3. rust-bitcoin 基礎

### 3.1 理解金額（Amount）

在 Bitcoin 內部，所有金額都以「聰」（satoshi）計算。一個 Bitcoin 等於一億聰（100,000,000 satoshi）。這種設計避免了浮點數運算的精度問題——在處理金錢時，這種精度至關重要。

```rust
use bitcoin::Amount;

fn amount_examples() {
    // 從聰創建金額
    let amount_sat = Amount::from_sat(100_000_000);  // 1 BTC

    // 從 BTC 創建金額（注意：可能失敗，因此返回 Result）
    let amount_btc = Amount::from_btc(1.0).unwrap();

    // 兩者相等
    assert_eq!(amount_sat, amount_btc);

    // 金額運算
    let fee = Amount::from_sat(1000);
    let total = amount_btc + fee;

    // 使用 checked_sub 避免溢位（金額不能為負）
    let remaining = amount_btc.checked_sub(fee)
        .expect("金額不足");
}
```

`Amount` 類型防止了一個常見錯誤：混淆 BTC 和 satoshi 單位。編譯器會確保你在運算時使用相同的單位。

### 3.2 網路類型（Network）

Bitcoin 有多個網路，每個網路使用不同的地址前綴和協議參數：

```rust
use bitcoin::Network;

fn network_examples() {
    let mainnet = Network::Bitcoin;   // 正式網路，使用真實的 BTC
    let testnet = Network::Testnet;   // 測試網路，使用無價值的測試幣
    let signet = Network::Signet;     // 簽名測試網路，更穩定的測試環境
    let regtest = Network::Regtest;   // 本地回歸測試網路
}
```

在開發過程中，應該始終使用測試網路（testnet 或 signet），直到程式碼經過充分測試。在測試網路上犯錯不會有任何財務損失，但在主網上的錯誤可能是災難性的。

### 3.3 哈希函數

Bitcoin 大量使用哈希函數，每種函數都有特定用途：

**SHA256** 是基礎的哈希函數，輸出 32 bytes。

**Double SHA256（SHA256d）** 是對資料進行兩次 SHA256。Bitcoin 在許多地方使用這種雙重哈希，包括交易 ID、區塊雜湊等。這可能是為了防止某些理論上的攻擊（長度擴展攻擊），雖然對 SHA256 來說這可能是過度謹慎。

**RIPEMD160** 是一個輸出 20 bytes 的哈希函數。

**HASH160** 是 SHA256 後接 RIPEMD160，用於生成公鑰的雜湊值，進而生成地址。使用這個組合而不是單純的 SHA256 是為了得到更短的輸出（20 bytes vs 32 bytes），減少地址長度。

```rust
use bitcoin::hashes::{sha256, sha256d, ripemd160, hash160, Hash};

fn hash_examples() {
    let data = b"Hello, Bitcoin!";

    // SHA256
    let sha256_hash = sha256::Hash::hash(data);

    // Double SHA256（Bitcoin 標準）
    let sha256d_hash = sha256d::Hash::hash(data);

    // HASH160（用於地址生成）
    let hash160_result = hash160::Hash::hash(data);
}
```

### 3.4 secp256k1 橢圓曲線

Bitcoin 使用 secp256k1 橢圓曲線進行公鑰密碼學。理解這個曲線的基本概念對於 Bitcoin 開發很重要。

私鑰本質上是一個 256 位的隨機數。這個數字必須在 1 到曲線的階（一個非常大的質數）之間。任何在這個範圍內的數字都是有效的私鑰。

公鑰是橢圓曲線上的一個點，由私鑰乘以曲線的生成點 G 得到：`P = k * G`，其中 k 是私鑰，P 是公鑰。這個運算是單向的——從公鑰無法推導出私鑰（這就是橢圓曲線離散對數問題）。

```rust
use secp256k1::{Secp256k1, SecretKey, PublicKey};

fn key_generation() {
    // 創建 secp256k1 上下文
    let secp = Secp256k1::new();

    // 生成隨機私鑰
    let mut rng = rand::thread_rng();
    let secret_key = SecretKey::new(&mut rng);

    // 從私鑰導出公鑰
    let public_key = PublicKey::from_secret_key(&secp, &secret_key);

    // 公鑰有兩種序列化格式
    let compressed = public_key.serialize();      // 33 bytes
    let uncompressed = public_key.serialize_uncompressed();  // 65 bytes
}
```

壓縮公鑰只包含 x 座標和一個表示 y 座標正負的位元（因為給定 x，y 只有兩個可能值）。未壓縮公鑰包含完整的 x 和 y 座標。現代 Bitcoin 幾乎總是使用壓縮公鑰，因為它更短且同樣安全。

---

## 4. 編碼與序列化

### 4.1 十六進制編碼

Bitcoin 資料在顯示時幾乎總是使用十六進制（hex）格式。這是因為二進位資料不方便閱讀或複製，而十六進制提供了一個緊湊的文字表示。

```rust
fn hex_examples() {
    let data = vec![0xde, 0xad, 0xbe, 0xef];

    // 編碼為十六進制字串
    let hex_string = hex::encode(&data);  // "deadbeef"

    // 從十六進制解碼
    let decoded: Vec<u8> = hex::decode("deadbeef").unwrap();
}
```

### 4.2 Base58Check 編碼

傳統的 Bitcoin 地址使用 Base58Check 編碼。Base58 是 Base64 的變體，移除了容易混淆的字元（0、O、I、l），避免人工抄寫時的錯誤。

Base58Check 在 Base58 的基礎上增加了版本前綴和校驗和。版本前綴指示地址類型（P2PKH、P2SH 等）和網路（mainnet、testnet）。校驗和是資料的 double SHA256 的前 4 bytes，用於檢測輸入錯誤。

```rust
use bitcoin::hashes::{sha256d, Hash};
use bs58;

fn base58check_encode(version: u8, payload: &[u8]) -> String {
    let mut data = vec![version];
    data.extend_from_slice(payload);

    // 計算校驗和
    let checksum = sha256d::Hash::hash(&data);
    data.extend_from_slice(&checksum[..4]);

    bs58::encode(data).into_string()
}
```

版本位元組決定了地址的前綴：mainnet P2PKH 地址以 '1' 開頭（版本 0x00），P2SH 地址以 '3' 開頭（版本 0x05）。

### 4.3 Bech32 編碼

SegWit 引入了新的地址格式 Bech32（BIP 173），Taproot 則使用改進版的 Bech32m（BIP 350）。這些格式有幾個優點：

首先，它們只使用小寫字母和數字，避免了大小寫混淆。其次，錯誤檢測能力更強，可以檢測到更多類型的輸入錯誤。第三，它們自帶人類可讀的前綴（HRP），使網路識別更容易——mainnet 地址以 "bc1" 開頭，testnet 以 "tb1" 開頭。

```rust
use bitcoin::Address;

fn bech32_address_info() {
    // bc1q... 是 SegWit v0 地址（P2WPKH 或 P2WSH）
    // bc1p... 是 SegWit v1 地址（P2TR，Taproot）

    // Bech32 用於 v0，Bech32m 用於 v1+
    // 這個改變修復了 Bech32 的一個極端情況問題
}
```

### 4.4 Bitcoin 共識編碼

Bitcoin 協議使用特定的二進位編碼格式，稱為「共識編碼」。理解這個格式對於解析和創建原始交易很重要。

Bitcoin 使用小端序（Little Endian）來編碼多位元組整數。這與網路協議常用的大端序不同。

變長整數（VarInt）是一種空間優化的編碼方式。小於 253 的數字只用 1 byte，較大的數字則根據大小使用 3、5 或 9 bytes。這種編碼在交易中大量使用（例如表示輸入/輸出數量）。

```rust
fn encode_varint(n: u64) -> Vec<u8> {
    if n < 0xFD {
        vec![n as u8]
    } else if n <= 0xFFFF {
        let mut v = vec![0xFD];
        v.extend(&(n as u16).to_le_bytes());
        v
    } else if n <= 0xFFFFFFFF {
        let mut v = vec![0xFE];
        v.extend(&(n as u32).to_le_bytes());
        v
    } else {
        let mut v = vec![0xFF];
        v.extend(&n.to_le_bytes());
        v
    }
}
```

---

## 5. 錯誤處理

### 5.1 Rust 的錯誤處理哲學

Rust 的錯誤處理與許多語言不同。它不使用例外（exceptions），而是透過類型系統明確表示可能失敗的操作。這迫使程式設計師在編譯時就考慮錯誤情況。

`Result<T, E>` 類型表示一個可能成功（返回 `T`）或失敗（返回 `E`）的操作。`Option<T>` 則表示一個可能存在（`Some(T)`）或不存在（`None`）的值。

```rust
use anyhow::{Context, Result};
use thiserror::Error;

// 使用 thiserror 定義自訂錯誤類型
#[derive(Error, Debug)]
pub enum BitcoinError {
    #[error("無效的私鑰: {0}")]
    InvalidPrivateKey(String),

    #[error("金額不足: 需要 {required} sat, 只有 {available} sat")]
    InsufficientFunds { required: u64, available: u64 },
}
```

`thiserror` 庫幫助你定義結構化的錯誤類型，適合函式庫使用。`anyhow` 則提供了一個通用的錯誤類型，適合應用程式——它可以包裝任何錯誤並附加上下文資訊。

### 5.2 實用的錯誤處理模式

在 Bitcoin 開發中，錯誤處理特別重要。一個常見的模式是使用 `?` 運算符傳播錯誤，並用 `context()` 添加有意義的錯誤訊息：

```rust
fn process_transaction(tx_hex: &str) -> Result<()> {
    let tx_bytes = hex::decode(tx_hex)
        .context("無法解析交易十六進制")?;

    let tx: Transaction = consensus::deserialize(&tx_bytes)
        .context("無效的交易格式")?;

    // 處理交易...

    Ok(())
}
```

當這個函數失敗時，錯誤訊息會包含完整的上下文鏈，幫助診斷問題：「無法解析交易十六進制: invalid character 'g' at position 10」。

---

## 6. 第一個程式：生成地址

### 6.1 從隨機數生成地址

現在讓我們把所有概念結合起來，寫一個完整的地址生成程式。這個程式展示了從隨機私鑰到 Bitcoin 地址的完整流程：

```rust
use bitcoin::{
    Network, Address, PublicKey, PrivateKey,
    secp256k1::Secp256k1,
};
use rand::thread_rng;

fn generate_random_address() -> anyhow::Result<()> {
    let secp = Secp256k1::new();
    let mut rng = thread_rng();

    // 生成隨機私鑰
    let secret_key = secp256k1::SecretKey::new(&mut rng);
    let private_key = PrivateKey::new(secret_key, Network::Bitcoin);

    // 導出公鑰
    let public_key = private_key.public_key(&secp);

    // 生成不同類型的地址
    let p2pkh = Address::p2pkh(&public_key, Network::Bitcoin);
    let p2wpkh = Address::p2wpkh(&public_key, Network::Bitcoin);
    let p2shwpkh = Address::p2shwpkh(&public_key, Network::Bitcoin);

    println!("私鑰 (WIF): {}", private_key.to_wif());
    println!("P2PKH 地址:    {}", p2pkh);
    println!("P2WPKH 地址:   {}", p2wpkh);
    println!("P2SH-P2WPKH:   {}", p2shwpkh);

    Ok(())
}
```

這裡展示了三種地址類型：

**P2PKH（Pay-to-Public-Key-Hash）**是最傳統的地址類型，以 '1' 開頭。它直接鎖定到公鑰的雜湊值。

**P2WPKH（Pay-to-Witness-Public-Key-Hash）**是原生 SegWit 地址，以 'bc1q' 開頭。它提供較低的交易費用和更好的安全性。

**P2SH-P2WPKH** 是包裝在 P2SH 中的 SegWit，以 '3' 開頭。它提供了與舊錢包的兼容性。

### 6.2 從助記詞生成地址

在實際應用中，我們通常不會直接生成隨機私鑰，而是使用助記詞（BIP39）和分層確定性派生（BIP32）。這種方法有幾個優點：用戶只需備份一組助記詞就能恢復所有地址；從同一個種子可以派生出無限多個地址；不同的派生路徑可以用於不同目的。

```rust
use bip39::{Mnemonic, Language};
use bitcoin::bip32::{Xpriv, Xpub, DerivationPath};
use std::str::FromStr;

fn generate_from_mnemonic() -> anyhow::Result<()> {
    let secp = Secp256k1::new();

    // 生成 12 字助記詞
    let mnemonic = Mnemonic::generate_in(Language::English, 12)?;
    println!("助記詞: {}", mnemonic);

    // 從助記詞生成種子（可選的密碼短語）
    let seed = mnemonic.to_seed("");

    // 生成主私鑰
    let master_xpriv = Xpriv::new_master(Network::Bitcoin, &seed)?;

    // 使用 BIP84 路徑派生原生 SegWit 地址
    // m/84'/0'/0'/0/0
    let path = DerivationPath::from_str("m/84'/0'/0'/0/0")?;
    let derived_xpriv = master_xpriv.derive_priv(&secp, &path)?;
    let derived_xpub = Xpub::from_priv(&secp, &derived_xpriv);

    let public_key = PublicKey::new(derived_xpub.public_key);
    let address = Address::p2wpkh(&public_key, Network::Bitcoin);

    println!("派生地址: {}", address);

    Ok(())
}
```

派生路徑 `m/84'/0'/0'/0/0` 遵循 BIP84 標準：
- `84'` 表示這是 BIP84（原生 SegWit）路徑
- 第一個 `0'` 是 coin type（Bitcoin）
- 第二個 `0'` 是帳戶索引
- `0` 是外部鏈（接收地址，vs 1 是找零地址）
- 最後的 `0` 是地址索引

撇號（'）表示「硬化」派生，這種派生方式即使公開了子公鑰，也無法推導出父私鑰。

---

## 7. 練習題

### 練習 1：批量地址生成器

創建一個程式，從同一個助記詞批量生成 10 個地址。使用 BIP84 派生路徑（m/84'/0'/0'/0/i），其中 i 從 0 到 9。這個練習幫助你理解 HD 錢包的工作原理。

### 練習 2：地址驗證器

創建一個函數，接受一個字串並驗證它是否是有效的 Bitcoin 地址。你的函數應該：
- 識別地址類型（P2PKH、P2SH、P2WPKH、P2WSH、P2TR）
- 驗證校驗和（對於 Base58 和 Bech32）
- 判斷網路（mainnet vs testnet）

### 練習 3：哈希計算器

創建一個命令列工具，計算輸入的各種 Bitcoin 相關雜湊值。支援 SHA256、SHA256d、RIPEMD160 和 HASH160，並能處理十六進制和 UTF-8 輸入。

---

## 8. 總結

本篇介紹了使用 Rust 進行 Bitcoin 開發的基礎知識。我們討論了為什麼 Rust 是 Bitcoin 開發的理想選擇——它的記憶體安全、效能和豐富的生態系統。我們設置了開發環境，了解了 rust-bitcoin 函式庫的基本類型，學習了 Bitcoin 使用的各種編碼格式，並寫出了第一個地址生成程式。

關鍵要點：
- Bitcoin 內部使用 satoshi 作為金額單位
- secp256k1 橢圓曲線是 Bitcoin 密碼學的基礎
- 不同的地址類型有不同的用途和特性
- HD 錢包讓一組助記詞可以派生出無限地址

下一篇將深入探討地址生成的細節和交易構建的基礎。我們將學習如何創建、簽名和廣播真正的 Bitcoin 交易。

---

## 參考資源

### 官方文檔
- [rust-bitcoin 文檔](https://docs.rs/bitcoin)
- [secp256k1 文檔](https://docs.rs/secp256k1)
- [BDK 文檔](https://docs.rs/bdk)

### 學習資源
- [Rust 程式設計語言](https://doc.rust-lang.org/book/)
- [rust-bitcoin GitHub](https://github.com/rust-bitcoin/rust-bitcoin)

### BIPs
- [BIP 32: HD Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [BIP 39: Mnemonic Code](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [BIP 84: Native SegWit](https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki)
