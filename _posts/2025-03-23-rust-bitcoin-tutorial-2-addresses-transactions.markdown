---
layout: post
title: "Rust Bitcoin 開發入門（二）：地址生成與交易構建"
date: 2025-03-23
categories: [技術教學, Bitcoin, Rust]
tags: [Rust, Bitcoin, 地址, 交易, HD錢包, BIP32, BIP39, BIP44]
author: Cypherpunks Taiwan
---

這是 Rust Bitcoin 開發入門系列的第二篇。本篇深入探討 Bitcoin 地址的生成機制和交易的構建過程。

**系列文章導航：**
- [第一篇：環境設置與基礎概念](/2025/03/22/rust-bitcoin-tutorial-1-environment-basics/)
- **第二篇：地址生成與交易構建**（本篇）
- [第三篇：腳本與簽名](/2025/03/24/rust-bitcoin-tutorial-3-scripts-signatures/)
- [第四篇：進階應用與整合](/2025/03/25/rust-bitcoin-tutorial-4-advanced-applications/)

---

## 1. HD 錢包深入理解

### 1.1 為什麼需要 HD 錢包

在 Bitcoin 早期，用戶需要為每筆交易手動生成新的私鑰，並分別備份每一個私鑰。這種方式有明顯的問題：備份繁瑣、容易丟失，而且如果使用舊備份恢復錢包，可能會遺漏新生成的地址中的資金。

BIP32 提出了層級確定性（Hierarchical Deterministic，HD）錢包的概念，徹底改變了這個情況。HD 錢包從一個「種子」衍生出所有的私鑰，這意味著你只需要備份一次種子，就能恢復整個錢包的所有地址——包括未來創建的地址。

這個設計的數學基礎是單向函數和哈希函數的特性：從種子可以確定性地計算出無限多個子密鑰，但從子密鑰無法反推種子。這提供了安全性和便利性的完美平衡。

### 1.2 BIP32 層級派生

BIP32 定義了密鑰派生的具體方法。每個密鑰都可以派生出子密鑰，形成一個樹狀結構。派生路徑用斜線分隔的數字表示，例如 `m/44'/0'/0'/0/0`。

路徑中的每個數字代表一層派生：
- `m` 是主密鑰（master key），從種子直接生成
- 數字後面的撇號（'）表示「硬化派生」（hardened derivation）
- 沒有撇號的數字表示「普通派生」（normal derivation）

硬化派生和普通派生的區別至關重要。普通派生允許從父公鑰派生子公鑰，這意味著如果攻擊者獲得了擴展公鑰（xpub），他可以計算出所有非硬化路徑下的子公鑰。更危險的是，如果攻擊者同時獲得了任何一個子私鑰和父公鑰，他就能推算出父私鑰。

硬化派生解決了這個問題。它的派生過程需要父私鑰參與，因此即使攻擊者獲得了擴展公鑰，也無法推導出硬化路徑下的子密鑰。這就是為什麼 purpose、coin type 和 account 層級總是使用硬化派生。

```rust
use bitcoin::bip32::{Xpriv, Xpub, DerivationPath, ChildNumber};
use bitcoin::Network;
use bitcoin::secp256k1::Secp256k1;

fn hd_derivation_demo() -> anyhow::Result<()> {
    let secp = Secp256k1::new();

    // 從種子創建主私鑰
    let seed = hex::decode(
        "000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f"
    )?;

    let master_xpriv = Xpriv::new_master(Network::Bitcoin, &seed)?;
    let master_xpub = Xpub::from_priv(&secp, &master_xpriv);

    // 硬化派生：m/0'
    // 注意 index 使用 0，但指定為 Hardened
    let child_hardened = master_xpriv.derive_priv(
        &secp,
        &[ChildNumber::Hardened { index: 0 }]
    )?;

    // 普通派生：m/0
    let child_normal = master_xpriv.derive_priv(
        &secp,
        &[ChildNumber::Normal { index: 0 }]
    )?;

    // 使用派生路徑字串
    let path = DerivationPath::from_str("m/84'/0'/0'/0/0")?;
    let derived = master_xpriv.derive_priv(&secp, &path)?;

    Ok(())
}
```

### 1.3 BIP39 助記詞

雖然種子是一串隨機的位元組，但人類很難記憶或抄寫這樣的數據。BIP39 提出了助記詞（mnemonic）的概念，將種子編碼為一組英文單詞。

助記詞的生成過程是這樣的：首先生成一定長度的隨機熵（128 到 256 位），然後計算熵的 SHA256 校驗和，取校驗和的前幾位附加到熵的末尾。最後將這個組合數據分割成 11 位一組，每組對應 BIP39 字典中的一個單詞。

熵的長度決定了助記詞的數量。128 位熵產生 12 個單詞，256 位熵產生 24 個單詞。更長的助記詞提供更高的安全性，但 12 個單詞（128 位熵）在實際使用中已經足夠安全。

```rust
use bip39::{Mnemonic, Language};

fn mnemonic_demo() -> anyhow::Result<()> {
    // 生成 12 字助記詞
    let mnemonic = Mnemonic::generate_in(Language::English, 12)?;
    println!("助記詞: {}", mnemonic);

    // 從助記詞生成種子
    // 可以使用可選的密碼短語增加安全性
    let passphrase = "";
    let seed = mnemonic.to_seed(passphrase);

    // 種子是 512 位（64 bytes）
    println!("種子長度: {} bytes", seed.len());

    // 驗證現有助記詞
    let phrase = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
    let parsed = Mnemonic::parse_in(Language::English, phrase)?;

    // 獲取原始熵
    let entropy = parsed.to_entropy();
    println!("熵: {}", hex::encode(&entropy));

    Ok(())
}
```

密碼短語（passphrase）是一個重要但經常被忽視的功能。它在從助記詞生成種子時作為額外的輸入。不同的密碼短語會生成完全不同的種子，從而產生完全不同的錢包。這提供了額外的安全層：即使攻擊者獲得了你的助記詞，沒有密碼短語他也無法存取你的資金。這也可以用來創建「誘餌錢包」——使用空密碼短語的錢包放少量資金，真正的資金存放在有密碼短語的錢包中。

### 1.4 標準派生路徑

隨著時間推移，社區制定了多個 BIP 來標準化派生路徑，確保不同錢包軟體之間的互操作性。

**BIP44** 定義了傳統地址（P2PKH）的路徑格式：`m/44'/coin'/account'/change/index`。這裡 44 是 purpose，表示遵循 BIP44 標準。coin 是幣種代碼（Bitcoin 是 0，Testnet 是 1）。account 允許用戶在同一個錢包中維護多個獨立的帳戶。change 為 0 表示外部鏈（用於接收付款），為 1 表示內部鏈（用於找零）。index 是地址的序號。

**BIP49** 為 P2SH-P2WPKH（兼容 SegWit）地址定義了 purpose 49。

**BIP84** 為原生 SegWit（P2WPKH）地址定義了 purpose 84。

**BIP86** 為 Taproot（P2TR）地址定義了 purpose 86。

```rust
use bitcoin::bip32::{Xpriv, DerivationPath};
use bitcoin::{Network, Address, PublicKey};
use bitcoin::secp256k1::Secp256k1;

struct HDWallet {
    master_xpriv: Xpriv,
    network: Network,
}

impl HDWallet {
    fn derive_address(&self, purpose: u32, account: u32, is_change: bool, index: u32)
        -> anyhow::Result<Address>
    {
        let secp = Secp256k1::new();
        let coin = if self.network == Network::Bitcoin { 0 } else { 1 };
        let change = if is_change { 1 } else { 0 };

        let path = DerivationPath::from_str(&format!(
            "m/{}'/{}'/{}'/{}'/{}",
            purpose, coin, account, change, index
        ))?;

        let derived_xpriv = self.master_xpriv.derive_priv(&secp, &path)?;
        let public_key = PublicKey::new(
            derived_xpriv.to_priv().public_key(&secp)
        );

        let address = match purpose {
            44 => Address::p2pkh(&public_key, self.network),
            49 => Address::p2shwpkh(&public_key, self.network),
            84 => Address::p2wpkh(&public_key, self.network),
            86 => {
                let internal_key = bitcoin::key::UntweakedPublicKey::from(
                    derived_xpriv.to_priv().public_key(&secp)
                );
                Address::p2tr(&secp, internal_key, None, self.network)
            }
            _ => anyhow::bail!("不支援的 purpose: {}", purpose),
        };

        Ok(address)
    }
}
```

---

## 2. 地址類型詳解

### 2.1 地址的本質

Bitcoin 地址不是存儲資金的「帳戶」，而是指定誰可以花費資金的「條件」的編碼形式。當你發送 Bitcoin 到一個地址時，實際上是在創建一個輸出，這個輸出被一個特定的腳本鎖定。地址是這個鎖定腳本的便於人類閱讀的表示。

不同的地址類型對應不同的腳本模式。理解這些差異對於開發者來說很重要，因為它們影響交易大小、費用和功能。

### 2.2 P2PKH（Pay-to-Public-Key-Hash）

P2PKH 是最原始的地址類型，以數字 1 開頭。它的鎖定腳本要求提供一個公鑰和對應的簽名，且公鑰的雜湊值必須匹配地址中編碼的值。

這種設計有一個隱私優點：在資金被花費之前，公鑰不會出現在區塊鏈上，只有公鑰的雜湊值是可見的。這為抵禦某些理論上的量子計算攻擊提供了一定保護——即使量子電腦能從公鑰推導私鑰，在公鑰暴露之前，資金仍然是安全的。

```rust
use bitcoin::{Address, PublicKey, Network};

fn p2pkh_demo(public_key: &PublicKey) {
    let address = Address::p2pkh(public_key, Network::Bitcoin);
    // 格式：1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2

    // 對應的 scriptPubKey：
    // OP_DUP OP_HASH160 <pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG
}
```

### 2.3 P2SH（Pay-to-Script-Hash）

P2SH 以數字 3 開頭，允許支付到任意腳本的雜湊值，而不是特定的公鑰雜湊。這種靈活性使得複雜的腳本（如多重簽名）可以使用簡短的地址表示。

P2SH 的一個常見用途是包裝 SegWit 腳本（P2SH-P2WPKH 和 P2SH-P2WSH），為不支援原生 SegWit 地址的舊錢包提供兼容性。發送者不需要知道底層使用的是什麼腳本——他們只需支付到這個以 3 開頭的地址即可。

### 2.4 P2WPKH（原生 SegWit）

P2WPKH 是 SegWit 升級引入的原生見證地址類型，以 bc1q 開頭。它的功能與 P2PKH 類似，但簽名數據被移到了交易的「見證」部分，不計入傳統的區塊大小限制。

這帶來了多個好處。首先是費用節省：見證數據的費用權重只有非見證數據的四分之一，典型的 P2WPKH 交易比 P2PKH 交易便宜約 38%。其次是解決了交易可延展性（malleability）問題，這對於閃電網路等二層協議至關重要。

```rust
fn p2wpkh_demo(public_key: &PublicKey) {
    let address = Address::p2wpkh(public_key, Network::Bitcoin);
    // 格式：bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4

    // scriptPubKey 很簡短：
    // OP_0 <20-byte-pubkey-hash>
}
```

### 2.5 P2TR（Taproot）

P2TR 是 2021 年啟用的 Taproot 升級引入的地址類型，以 bc1p 開頭。它代表了 Bitcoin 腳本能力的重大進步。

Taproot 地址可以通過兩種方式花費：密鑰路徑（key path）和腳本路徑（script path）。密鑰路徑是最簡單的情況——只需提供一個 Schnorr 簽名。腳本路徑允許使用複雜的條件，但這些條件被隱藏在 Merkle 樹中，只有在使用特定條件時才會揭示。

這種設計的隱私優勢是巨大的。無論底層腳本多複雜，如果所有參與者同意（使用密鑰路徑），交易看起來就像一個普通的單簽名交易。觀察者無法區分簡單支付和複雜的多方協議。

```rust
fn p2tr_demo(secp: &Secp256k1<secp256k1::All>, private_key: &PrivateKey) {
    let internal_key = bitcoin::key::UntweakedPublicKey::from(
        private_key.public_key(secp)
    );

    // 只有密鑰路徑，沒有腳本樹
    let address = Address::p2tr(secp, internal_key, None, Network::Bitcoin);
    // 格式：bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr
}
```

### 2.6 地址解析與驗證

在處理用戶輸入的地址時，驗證非常重要。無效的地址會導致資金永久丟失。rust-bitcoin 提供了完整的地址解析和驗證功能。

```rust
use bitcoin::{Address, Network};
use std::str::FromStr;

fn validate_address(addr_str: &str, expected_network: Network) -> anyhow::Result<Address> {
    // 解析地址（這會驗證格式和校驗和）
    let address = Address::from_str(addr_str)?;

    // 驗證網路
    if !address.is_valid_for_network(expected_network) {
        anyhow::bail!("地址網路不匹配");
    }

    // assume_checked 表示我們已經驗證過了
    Ok(address.assume_checked())
}
```

---

## 3. 理解 UTXO 模型

### 3.1 UTXO vs 帳戶模型

Bitcoin 使用 UTXO（Unspent Transaction Output，未花費交易輸出）模型，這與以太坊使用的帳戶模型有本質區別。

在帳戶模型中，每個地址有一個餘額，交易就是從一個帳戶減少餘額、向另一個帳戶增加餘額。這類似於傳統銀行帳戶的運作方式。

在 UTXO 模型中，沒有「餘額」的概念。取而代之的是一組獨立的「硬幣」——每個 UTXO 是之前某筆交易創建的一個輸出，它有特定的金額和花費條件。你的「餘額」是所有屬於你的 UTXO 的金額總和。

當你發送 Bitcoin 時，你必須選擇一個或多個 UTXO 作為輸入，完全消耗它們，然後創建新的輸出。如果輸入總額超過你想發送的金額，你需要創建一個「找零」輸出，將多餘的資金發回給自己。

這個模型有幾個重要的含義。首先，每個 UTXO 只能被花費一次——這是 Bitcoin 如何防止雙重支付的。其次，交易的隱私性受到 UTXO 選擇的影響——如果你合併多個 UTXO，觀察者可以推斷它們可能屬於同一個人。第三，UTXO 的數量會影響未來交易的費用——更多的輸入意味著更大的交易和更高的費用。

### 3.2 選幣策略

當構建交易時，選擇使用哪些 UTXO 是一個重要的決策。不同的選幣策略有不同的權衡。

最簡單的策略是「最大優先」——優先選擇金額最大的 UTXO。這通常能最小化所需的輸入數量，從而減少交易費用。但它也有缺點：小額 UTXO 可能永遠不會被使用，隨著時間推移，你會累積大量「粉塵」。

「先進先出」（FIFO）策略按 UTXO 的年齡排序，優先使用最老的。這有助於維持 UTXO 集的「健康」，避免碎片化。

更複雜的策略會考慮隱私因素，避免合併來自不同來源的 UTXO，或者使用「隨機」選擇來增加觀察者的分析難度。

```rust
struct UTXOSelector;

impl UTXOSelector {
    fn select_largest_first(
        utxos: &[UTXO],
        target: u64,
        fee_rate: u64,
    ) -> Option<Vec<UTXO>> {
        let mut sorted: Vec<_> = utxos.to_vec();
        sorted.sort_by(|a, b| b.amount.cmp(&a.amount));

        let mut selected = Vec::new();
        let mut total = 0u64;

        for utxo in sorted {
            // 估算這個輸入的費用
            let input_fee = Self::estimate_input_fee(fee_rate);

            // 跳過粉塵 UTXO
            if utxo.amount < input_fee {
                continue;
            }

            selected.push(utxo);
            total += utxo.amount;

            // 檢查是否已經夠了
            let required = target + Self::estimate_total_fee(&selected, fee_rate);
            if total >= required {
                return Some(selected);
            }
        }

        None
    }

    fn estimate_input_fee(fee_rate: u64) -> u64 {
        68 * fee_rate  // P2WPKH 輸入約 68 vbytes
    }

    fn estimate_total_fee(inputs: &[UTXO], fee_rate: u64) -> u64 {
        let base = 10 * fee_rate;  // 基礎開銷
        let outputs = 31 * 2 * fee_rate;  // 兩個輸出
        let inputs_fee = inputs.len() as u64 * 68 * fee_rate;
        base + outputs + inputs_fee
    }
}
```

---

## 4. 交易結構詳解

### 4.1 交易的組成

一筆 Bitcoin 交易由幾個部分組成：

**版本號（Version）**指示交易遵循的規則。版本 2 啟用了 BIP68 定義的相對時間鎖功能。

**輸入（Inputs）**是這筆交易花費的 UTXO 列表。每個輸入包含：
- 前一筆交易的 ID（txid）和輸出索引（vout），用於識別被花費的 UTXO
- 簽名腳本（scriptSig），對於 SegWit 交易這裡通常是空的
- 序列號（sequence），用於相對時間鎖和 RBF（Replace-By-Fee）信號

**輸出（Outputs）**是這筆交易創建的新 UTXO。每個輸出包含：
- 金額（以 satoshi 為單位）
- 鎖定腳本（scriptPubKey），定義誰可以花費這個輸出

**見證（Witness）**是 SegWit 引入的新欄位，包含每個輸入的簽名和其他驗證數據。

**鎖定時間（LockTime）**指定這筆交易可以被包含到區塊的最早時間（區塊高度或時間戳）。

```rust
use bitcoin::{
    Transaction, TxIn, TxOut, OutPoint, Txid, Sequence, Witness,
    ScriptBuf, Amount, transaction::Version, absolute::LockTime,
};

fn create_transaction_structure() -> Transaction {
    // 創建輸入
    let input = TxIn {
        previous_output: OutPoint {
            txid: Txid::from_str("...").unwrap(),
            vout: 0,
        },
        script_sig: ScriptBuf::new(),  // SegWit 交易為空
        sequence: Sequence::ENABLE_RBF_NO_LOCKTIME,
        witness: Witness::new(),
    };

    // 創建輸出
    let output = TxOut {
        value: Amount::from_sat(50_000),
        script_pubkey: ScriptBuf::new_p2wpkh(&wpkh),
    };

    Transaction {
        version: Version::TWO,
        lock_time: LockTime::ZERO,
        input: vec![input],
        output: vec![output],
    }
}
```

### 4.2 交易大小與費用

Bitcoin 的交易費用是按交易大小計算的，但 SegWit 引入了「權重」的概念來更精確地衡量交易對區塊空間的消耗。

交易權重的計算方式是：非見證數據的位元組數乘以 4，加上見證數據的位元組數。然後將權重除以 4 得到「虛擬大小」（vsize），這是計算費用時使用的單位。

這個設計給了見證數據 75% 的「折扣」，鼓勵使用 SegWit，因為見證數據不會永久存儲在每個節點的 UTXO 集中。

```rust
struct FeeCalculator;

impl FeeCalculator {
    // P2WPKH 輸入的重量：約 271 WU（68 vbytes）
    // P2TR 輸入的重量：約 229 WU（58 vbytes）
    // P2WPKH 輸出的重量：124 WU（31 vbytes）
    // P2TR 輸出的重量：172 WU（43 vbytes）

    fn calculate_fee(tx: &Transaction, fee_rate: u64) -> u64 {
        let weight = tx.weight();
        let vsize = weight.to_vbytes_ceil();
        vsize * fee_rate
    }
}
```

### 4.3 RBF（Replace-By-Fee）

RBF 是一種允許未確認交易被替換的機制。當一筆交易的確認時間比預期長（因為費用設得太低），發送者可以廣播一個新版本，支付更高的費用。

要啟用 RBF，至少一個輸入的序列號必須小於 0xFFFFFFFE。rust-bitcoin 提供了便利的常量來設置這個值。

```rust
use bitcoin::Sequence;

// 啟用 RBF，不使用鎖定時間
let sequence = Sequence::ENABLE_RBF_NO_LOCKTIME;

// 最大序列號（禁用 RBF）
let no_rbf = Sequence::MAX;
```

---

## 5. 構建並簽名交易

### 5.1 簽名過程

簽名一筆 Bitcoin 交易涉及多個步驟。首先需要計算「簽名哈希」（sighash），這是對交易數據的一個特定摘要，簽名者需要對這個摘要簽名。

對於 SegWit 交易，簽名哈希的計算遵循 BIP143 的規定，這與傳統交易不同。主要區別是 BIP143 的 sighash 包含每個輸入被花費的 UTXO 的金額，這消除了某些類型的攻擊。

簽名類型（sighash type）指定了簽名涵蓋交易的哪些部分：
- `SIGHASH_ALL`（最常見）：簽名涵蓋所有輸入和輸出
- `SIGHASH_NONE`：只簽名輸入，允許任何人修改輸出
- `SIGHASH_SINGLE`：簽名一個輸入和對應的輸出
- 可以與 `ANYONECANPAY` 組合，只簽名當前輸入，允許添加更多輸入

```rust
use bitcoin::sighash::{SighashCache, EcdsaSighashType};
use bitcoin::secp256k1::{Secp256k1, Message};

fn sign_p2wpkh_input(
    tx: &mut Transaction,
    input_index: usize,
    utxo_amount: Amount,
    private_key: &PrivateKey,
) -> anyhow::Result<()> {
    let secp = Secp256k1::new();
    let public_key = private_key.public_key(&secp);

    // P2WPKH 的 scriptCode 是對應 P2PKH 的 scriptPubKey
    let script_code = ScriptBuf::new_p2pkh(&public_key.pubkey_hash());

    // 計算簽名哈希
    let mut sighash_cache = SighashCache::new(&*tx);
    let sighash = sighash_cache.p2wpkh_signature_hash(
        input_index,
        &script_code,
        utxo_amount,
        EcdsaSighashType::All,
    )?;

    // 創建簽名
    let message = Message::from_digest_slice(sighash.as_byte_array())?;
    let signature = secp.sign_ecdsa(&message, &private_key.inner);

    // 組裝 witness：[signature, pubkey]
    let mut sig_bytes = signature.serialize_der().to_vec();
    sig_bytes.push(EcdsaSighashType::All.to_u32() as u8);

    tx.input[input_index].witness.push(sig_bytes);
    tx.input[input_index].witness.push(public_key.to_bytes());

    Ok(())
}
```

### 5.2 PSBT（部分簽名交易）

PSBT（Partially Signed Bitcoin Transaction）是 BIP174 定義的標準格式，用於在多方之間傳遞待簽名的交易。它對於多重簽名、硬體錢包和其他需要多步驟簽名的場景非常有用。

PSBT 包含了簽名者需要的所有資訊：未簽名的交易、每個輸入被花費的 UTXO 資訊、派生路徑等。簽名者可以添加自己的簽名，然後將 PSBT 傳遞給下一個簽名者或組合者。

一個典型的 PSBT 工作流程是：
1. **創建者**創建一個基礎的 PSBT，包含未簽名交易
2. **更新者**添加 UTXO 資訊、派生路徑等元數據
3. **簽名者**為他們控制的輸入添加簽名
4. **組合者**將多個部分簽名的 PSBT 合併
5. **最終化者**完成所有輸入的腳本，生成可廣播的交易
6. **廣播者**將交易廣播到網路

```rust
use bitcoin::psbt::Psbt;

fn psbt_workflow() -> anyhow::Result<()> {
    // 創建未簽名交易
    let unsigned_tx = create_unsigned_transaction()?;

    // 創建 PSBT
    let mut psbt = Psbt::from_unsigned_tx(unsigned_tx)?;

    // 添加 UTXO 資訊（簽名者需要這些）
    psbt.inputs[0].witness_utxo = Some(TxOut {
        value: Amount::from_sat(100_000),
        script_pubkey: sender_script,
    });

    // 序列化為 Base64（用於傳輸）
    let psbt_base64 = psbt.to_string();

    // 簽名者解析並簽名
    let mut psbt = Psbt::from_str(&psbt_base64)?;
    // ... 添加簽名 ...

    // 最終化並提取交易
    psbt.finalize_mut(&secp).expect("最終化失敗");
    let signed_tx = psbt.extract_tx()?;

    Ok(())
}
```

---

## 6. 實戰：完整的錢包實現

下面是一個簡單但完整的錢包實現，展示了從地址生成到交易廣播的整個流程。

```rust
use bitcoin::{
    Network, Address, PrivateKey, PublicKey,
    Transaction, TxIn, TxOut, OutPoint, Txid, Sequence, Witness,
    ScriptBuf, Amount,
    sighash::{SighashCache, EcdsaSighashType},
    transaction::Version,
    absolute::LockTime,
    secp256k1::Secp256k1,
};

pub struct Wallet {
    private_key: PrivateKey,
    public_key: PublicKey,
    address: Address,
    network: Network,
    secp: Secp256k1<secp256k1::All>,
}

pub struct UTXO {
    pub txid: Txid,
    pub vout: u32,
    pub amount: Amount,
}

impl Wallet {
    pub fn new(wif: &str) -> anyhow::Result<Self> {
        let secp = Secp256k1::new();
        let private_key = PrivateKey::from_wif(wif)?;
        let public_key = private_key.public_key(&secp);
        let network = private_key.network;
        let address = Address::p2wpkh(&public_key, network);

        Ok(Self {
            private_key,
            public_key,
            address,
            network,
            secp,
        })
    }

    pub fn create_and_sign_transaction(
        &self,
        utxos: Vec<UTXO>,
        recipient: &Address,
        amount: Amount,
        fee_rate: u64,
    ) -> anyhow::Result<Transaction> {
        // 計算總輸入金額
        let total_input: Amount = utxos.iter().map(|u| u.amount).sum();

        // 估算費用
        let estimated_size = 10 + 68 * utxos.len() + 31 * 2;
        let fee = Amount::from_sat(estimated_size as u64 * fee_rate);

        // 計算找零
        let change = total_input.checked_sub(amount + fee)
            .ok_or_else(|| anyhow::anyhow!("餘額不足"))?;

        // 構建輸入
        let inputs: Vec<TxIn> = utxos.iter().map(|utxo| TxIn {
            previous_output: OutPoint {
                txid: utxo.txid,
                vout: utxo.vout,
            },
            script_sig: ScriptBuf::new(),
            sequence: Sequence::ENABLE_RBF_NO_LOCKTIME,
            witness: Witness::new(),
        }).collect();

        // 構建輸出
        let mut outputs = vec![TxOut {
            value: amount,
            script_pubkey: recipient.script_pubkey(),
        }];

        // 只有當找零超過粉塵限制時才添加找零輸出
        if change > Amount::from_sat(546) {
            outputs.push(TxOut {
                value: change,
                script_pubkey: self.address.script_pubkey(),
            });
        }

        // 創建交易
        let mut tx = Transaction {
            version: Version::TWO,
            lock_time: LockTime::ZERO,
            input: inputs,
            output: outputs,
        };

        // 簽名每個輸入
        let script_code = ScriptBuf::new_p2pkh(&self.public_key.pubkey_hash());

        for (i, utxo) in utxos.iter().enumerate() {
            let mut sighash_cache = SighashCache::new(&tx);
            let sighash = sighash_cache.p2wpkh_signature_hash(
                i,
                &script_code,
                utxo.amount,
                EcdsaSighashType::All,
            )?;

            let message = secp256k1::Message::from_digest_slice(
                sighash.as_byte_array()
            )?;
            let signature = self.secp.sign_ecdsa(&message, &self.private_key.inner);

            let mut sig_bytes = signature.serialize_der().to_vec();
            sig_bytes.push(EcdsaSighashType::All.to_u32() as u8);

            tx.input[i].witness.push(sig_bytes);
            tx.input[i].witness.push(self.public_key.to_bytes());
        }

        Ok(tx)
    }
}
```

這個實現展示了 Bitcoin 交易的核心概念：UTXO 選擇、費用計算、輸出創建和簽名生成。在生產環境中，你還需要添加錯誤處理、UTXO 查詢（通過節點 RPC 或區塊瀏覽器 API）、以及交易廣播功能。

---

## 7. 練習題

### 練習 1：實現地址間隔掃描

創建一個函數，使用「地址間隔」策略生成 HD 錢包地址。這是錢包恢復的標準方法：連續檢查地址直到遇到一定數量的未使用地址。

### 練習 2：交易解析器

實現一個函數，解析原始交易的十六進制表示，提取並顯示所有欄位：版本、輸入、輸出、見證數據和鎖定時間。

### 練習 3：UTXO 合併

創建一個函數，將多個小額 UTXO 合併成一個大額 UTXO。這在費率低的時候做可以節省未來交易的費用。考慮何時合併是經濟的（費用節省超過合併成本）。

---

## 8. 總結

本篇深入探討了 Bitcoin 地址和交易的技術細節。我們了解了 HD 錢包如何讓單一種子衍生出無限地址，不同地址類型的特性和用途，UTXO 模型如何運作，以及如何構建和簽名真實的交易。

關鍵要點：
- HD 錢包（BIP32/39/44/84）是現代錢包的標準
- 不同地址類型有不同的費用和功能特性
- UTXO 選擇策略影響交易費用和隱私
- SegWit 和 Taproot 提供更低的費用和更好的隱私
- PSBT 是多方簽名工作流程的標準格式

下一篇將深入探討 Bitcoin Script 編程和各種簽名機制。

---

## 參考資源

### BIP 文檔
- [BIP 32: HD Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [BIP 39: Mnemonic Code](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [BIP 44: Multi-Account Hierarchy](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)
- [BIP 84: Native SegWit](https://github.com/bitcoin/bips/blob/master/bip-0084.mediawiki)
- [BIP 174: PSBT](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki)

### 工具
- [Ian Coleman BIP39 Tool](https://iancoleman.io/bip39/)
- [Bitcoin Transaction Builder](https://coinb.in/)
