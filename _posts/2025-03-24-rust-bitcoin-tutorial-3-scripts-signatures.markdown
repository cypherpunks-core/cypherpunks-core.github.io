---
layout: post
title: "Rust Bitcoin 開發入門（三）：腳本與簽名"
date: 2025-03-24
categories: [技術教學, Bitcoin, Rust]
tags: [Rust, Bitcoin, Script, 簽名, ECDSA, Schnorr, Taproot, Miniscript]
author: Cypherpunks Taiwan
math: true
---

這是 Rust Bitcoin 開發入門系列的第三篇。本篇深入探討 Bitcoin Script 編程和各種簽名機制的 Rust 實現。

**系列文章導航：**
- [第一篇：環境設置與基礎概念](/2025/03/22/rust-bitcoin-tutorial-1-environment-basics/)
- [第二篇：地址生成與交易構建](/2025/03/23/rust-bitcoin-tutorial-2-addresses-transactions/)
- **第三篇：腳本與簽名**（本篇）
- [第四篇：進階應用與整合](/2025/03/25/rust-bitcoin-tutorial-4-advanced-applications/)

---

## 1. 理解 Bitcoin Script

### 1.1 什麼是 Bitcoin Script

Bitcoin Script 是 Bitcoin 的程式語言，用於定義資金的花費條件。每一筆 Bitcoin 輸出都被一個腳本「鎖定」，而花費這筆輸出需要提供一個能夠「解鎖」它的腳本。

Script 的設計有幾個重要特點。首先，它是基於堆疊（stack）的語言，類似於 Forth。操作數被推入堆疊，操作碼則從堆疊中取出操作數並將結果推回。其次，它故意不是圖靈完備的——沒有循環結構，執行時間是可預測的。這確保了節點可以快速驗證交易，不會被惡意的無限循環攻擊。

理解 Script 對於 Bitcoin 開發很重要，因為它是所有智能合約功能的基礎。從簡單的單簽名支付到複雜的多重簽名、時間鎖和條件支付，都是透過 Script 實現的。

### 1.2 腳本執行模型

當驗證一筆交易時，節點會執行以下過程：

1. 將花費者提供的解鎖腳本（scriptSig 或 witness）執行，結果留在堆疊上
2. 然後執行被花費輸出的鎖定腳本（scriptPubKey）
3. 如果執行完成後堆疊頂部是「真」（非零值），且沒有發生錯誤，則驗證通過

這種「先解鎖，後驗證」的模型讓花費者可以提供滿足條件的數據（如簽名），然後由鎖定腳本驗證這些數據是否正確。

```rust
use bitcoin::script::{Script, ScriptBuf, Builder};
use bitcoin::opcodes::all::*;

fn script_execution_demo() {
    // P2PKH 的鎖定腳本：
    // OP_DUP OP_HASH160 <pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG

    // 執行過程：
    // 1. 解鎖腳本推入：<signature> <pubkey>
    // 2. OP_DUP：複製堆疊頂部的 pubkey
    // 3. OP_HASH160：對複製的 pubkey 計算 hash
    // 4. 推入 pubkey_hash
    // 5. OP_EQUALVERIFY：比較兩個 hash，不相等則失敗
    // 6. OP_CHECKSIG：使用 signature 和 pubkey 驗證簽名
}
```

### 1.3 使用 Rust 構建腳本

rust-bitcoin 提供了多種構建腳本的方式。`Builder` 類型讓你可以逐步添加操作碼和數據：

```rust
use bitcoin::script::{Script, ScriptBuf, Builder};
use bitcoin::opcodes::all::*;

fn build_scripts() -> anyhow::Result<()> {
    // 使用 Builder 構建 P2PKH 腳本
    let pubkey_hash = hex::decode("89abcdefabbaabbaabbaabbaabbaabbaabbaabba")?;

    let p2pkh_script = Builder::new()
        .push_opcode(OP_DUP)
        .push_opcode(OP_HASH160)
        .push_slice(&pubkey_hash)
        .push_opcode(OP_EQUALVERIFY)
        .push_opcode(OP_CHECKSIG)
        .into_script();

    println!("Script: {}", p2pkh_script);
    println!("ASM: {}", p2pkh_script.to_asm_string());

    // 也可以使用便捷函數
    let pubkey_hash = bitcoin::PubkeyHash::from_str(
        "89abcdefabbaabbaabbaabbaabbaabbaabbaabba"
    )?;
    let p2pkh_shortcut = ScriptBuf::new_p2pkh(&pubkey_hash);

    // 兩種方式產生相同的腳本
    assert_eq!(p2pkh_script, p2pkh_shortcut);

    Ok(())
}
```

你也可以解析腳本來檢查其結構：

```rust
fn parse_script(script: &Script) {
    for instruction in script.instructions() {
        match instruction {
            Ok(bitcoin::script::Instruction::Op(op)) => {
                println!("操作碼: {:?}", op);
            }
            Ok(bitcoin::script::Instruction::PushBytes(data)) => {
                println!("數據: {}", hex::encode(data.as_bytes()));
            }
            Err(e) => println!("解析錯誤: {}", e),
        }
    }
}
```

---

## 2. 標準腳本類型

### 2.1 P2PK 和 P2PKH

**P2PK（Pay-to-Public-Key）**是最早的腳本類型，直接將公鑰嵌入腳本中。解鎖只需要提供簽名。這種格式現在已經不常用，因為它暴露了公鑰，而且腳本較長。

**P2PKH（Pay-to-Public-Key-Hash）**改進了這個設計，只在腳本中存儲公鑰的雜湊值。解鎖時需要同時提供公鑰和簽名。這有兩個好處：腳本更短，而且在資金被花費之前，公鑰不會暴露。

```rust
fn standard_scripts(pubkey: &PublicKey) -> anyhow::Result<()> {
    // P2PK：<pubkey> OP_CHECKSIG
    let p2pk = Builder::new()
        .push_key(pubkey)
        .push_opcode(OP_CHECKSIG)
        .into_script();

    // P2PKH：OP_DUP OP_HASH160 <pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG
    let p2pkh = ScriptBuf::new_p2pkh(&pubkey.pubkey_hash());

    println!("P2PK 大小: {} bytes", p2pk.len());
    println!("P2PKH 大小: {} bytes", p2pkh.len());
    // P2PKH 較短，因為 pubkey_hash 只有 20 bytes，而公鑰有 33 bytes

    Ok(())
}
```

### 2.2 P2SH

**P2SH（Pay-to-Script-Hash）**是一個強大的抽象，允許支付到任意腳本的雜湊值。發送者不需要知道腳本的內容——他們只需支付到一個以 3 開頭的地址。只有在花費時，完整的腳本才會被揭示。

這種設計有幾個優點。首先，複雜的腳本（如多重簽名）可以用短小的地址表示，減少發送者的負擔。其次，腳本的複雜性成本由花費者承擔，而不是發送者。第三，它為腳本升級提供了靈活性——只要雜湊值相同，底層腳本可以改變。

```rust
fn p2sh_demo(inner_script: &Script) {
    // P2SH：OP_HASH160 <script_hash> OP_EQUAL
    let p2sh = ScriptBuf::new_p2sh(&inner_script.script_hash());

    // 解鎖 P2SH 需要：
    // 1. 滿足內部腳本的數據
    // 2. 內部腳本本身

    // 例如，對於包裝的 P2PKH：
    // scriptSig: <sig> <pubkey> <serialized_p2pkh_script>
}
```

### 2.3 SegWit 腳本（P2WPKH 和 P2WSH）

SegWit（Segregated Witness）升級引入了新的腳本類型，將簽名數據移到交易的「見證」部分。這解決了交易可延展性問題，並降低了費用。

**P2WPKH** 是 P2PKH 的 SegWit 版本。鎖定腳本非常簡短：`OP_0 <20-byte-pubkey-hash>`。`OP_0` 表示見證版本 0。解鎖數據（簽名和公鑰）放在 witness 欄位中。

**P2WSH** 是 P2SH 的 SegWit 版本，使用 32-byte 的腳本雜湊：`OP_0 <32-byte-script-hash>`。

```rust
fn segwit_scripts(pubkey: &PublicKey) -> anyhow::Result<()> {
    // P2WPKH
    let wpkh = pubkey.wpubkey_hash()?;
    let p2wpkh = ScriptBuf::new_p2wpkh(&wpkh);

    // P2WSH（包裝多簽腳本）
    let multisig_script = create_multisig_script(2, &[pubkey1, pubkey2, pubkey3]);
    let wsh = multisig_script.wscript_hash();
    let p2wsh = ScriptBuf::new_p2wsh(&wsh);

    // SegWit 腳本的特點是非常簡短
    // 複雜度在 witness 中，費用較低

    Ok(())
}
```

### 2.4 Taproot（P2TR）

Taproot 是 Bitcoin 腳本能力的最新重大升級。P2TR 腳本的格式是 `OP_1 <32-byte-tweaked-pubkey>`，其中 `OP_1` 表示見證版本 1。

Taproot 的核心創新是「tweaked key」。輸出公鑰是內部公鑰加上一個調整值（tweak），這個調整值可以承諾（commit）到一棵腳本樹。這意味著：

- 如果所有參與者同意，可以使用密鑰路徑（key path）花費——只需一個簽名
- 如果需要使用特定條件，可以使用腳本路徑（script path）——揭示並執行該腳本
- 未使用的腳本永遠不會暴露，保護了隱私

```rust
fn taproot_scripts(secp: &Secp256k1<secp256k1::All>) -> anyhow::Result<()> {
    let internal_key = XOnlyPublicKey::from_str("...")?;

    // 簡單的 P2TR（無腳本樹）
    let p2tr = ScriptBuf::new_p2tr(secp, internal_key, None);

    // 帶腳本樹的 P2TR
    let script_a = Builder::new()
        .push_x_only_key(&internal_key)
        .push_opcode(OP_CHECKSIG)
        .into_script();

    let taproot = TaprootBuilder::new()
        .add_leaf(0, script_a)?
        .finalize(secp, internal_key)?;

    let tweaked_key = taproot.output_key();
    let p2tr_with_scripts = ScriptBuf::new_p2tr_tweaked(tweaked_key);

    Ok(())
}
```

---

## 3. 多重簽名

### 3.1 理解多重簽名

多重簽名（multisig）是 Bitcoin 最重要的腳本功能之一，要求多個密鑰中的一部分來授權交易。常見的配置包括 2-of-3（三個密鑰中任意兩個）和 3-of-5。

多重簽名有許多應用場景。對於個人用戶，它提供了備份和安全性——即使丟失一個密鑰，資金仍然可以取回；即使一個密鑰被盜，攻擊者也無法單獨花費資金。對於組織，它實現了共同控制——需要多人同意才能移動資金。

傳統的多簽使用 `OP_CHECKMULTISIG` 操作碼，但這有一些缺點：公鑰數量和門檻在腳本中可見，費用隨公鑰數量線性增加。Taproot 時代的多簽有更好的選擇，我們稍後會討論。

### 3.2 構建傳統多簽腳本

```rust
fn create_multisig_script(m: u8, pubkeys: &[PublicKey]) -> ScriptBuf {
    let n = pubkeys.len() as u8;
    assert!(m <= n && n <= 20, "無效的 M-of-N 參數");

    let mut builder = Builder::new().push_int(m as i64);

    for pubkey in pubkeys {
        builder = builder.push_key(pubkey);
    }

    builder
        .push_int(n as i64)
        .push_opcode(OP_CHECKMULTISIG)
        .into_script()
}

fn multisig_demo() -> anyhow::Result<()> {
    // 創建三個公鑰
    let pubkeys: Vec<PublicKey> = vec![
        PublicKey::from_str("02...")?,
        PublicKey::from_str("02...")?,
        PublicKey::from_str("02...")?,
    ];

    // 2-of-3 多簽
    let multisig = create_multisig_script(2, &pubkeys);

    // 通常包裝在 P2WSH 中以節省費用
    let p2wsh = ScriptBuf::new_p2wsh(&multisig.wscript_hash());

    println!("多簽腳本: {}", multisig);
    println!("P2WSH 腳本: {}", p2wsh);

    Ok(())
}
```

### 3.3 花費多簽

花費多簽交易需要提供足夠數量的有效簽名。對於傳統的 `OP_CHECKMULTISIG`，還需要注意一個著名的 bug：操作碼會額外消耗一個堆疊元素（通常使用 `OP_0` 佔位）。

```rust
fn spend_multisig(
    tx: &mut Transaction,
    input_index: usize,
    multisig_script: &Script,
    signatures: Vec<Vec<u8>>,
) {
    // 傳統多簽的解鎖腳本：
    // OP_0 <sig1> <sig2> ... <redeemScript>

    let mut witness = Witness::new();

    // OP_0（CHECKMULTISIG bug 的佔位符）
    witness.push(&[]);

    // 添加簽名
    for sig in signatures {
        witness.push(&sig);
    }

    // 對於 P2WSH，需要添加腳本
    witness.push(multisig_script.as_bytes());

    tx.input[input_index].witness = witness;
}
```

---

## 4. 簽名機制詳解

### 4.1 ECDSA 簽名

ECDSA（Elliptic Curve Digital Signature Algorithm）是 Bitcoin 最初使用的簽名演算法。簽名過程包括：

1. 計算要簽名的消息（交易數據的特定哈希）
2. 使用私鑰和隨機數生成簽名
3. 簽名由兩個數值 (r, s) 組成，以 DER 格式編碼

簽名哈希（sighash）的計算方式取決於腳本類型。傳統腳本使用原始的 sighash 演算法，而 SegWit 使用 BIP143 定義的新演算法，後者包含了被花費 UTXO 的金額，防止了某些類型的攻擊。

```rust
use bitcoin::sighash::{SighashCache, EcdsaSighashType};

fn ecdsa_signing(
    tx: &Transaction,
    input_index: usize,
    utxo_script: &Script,
    utxo_amount: Amount,
    private_key: &PrivateKey,
) -> anyhow::Result<Vec<u8>> {
    let secp = Secp256k1::new();
    let public_key = private_key.public_key(&secp);

    // 對於 P2WPKH，scriptCode 是對應的 P2PKH 腳本
    let script_code = ScriptBuf::new_p2pkh(&public_key.pubkey_hash());

    // 計算 BIP143 sighash
    let mut sighash_cache = SighashCache::new(tx);
    let sighash = sighash_cache.p2wpkh_signature_hash(
        input_index,
        &script_code,
        utxo_amount,
        EcdsaSighashType::All,
    )?;

    // 創建簽名
    let message = Message::from_digest_slice(sighash.as_byte_array())?;
    let signature = secp.sign_ecdsa(&message, &private_key.inner);

    // DER 編碼 + sighash type
    let mut sig_bytes = signature.serialize_der().to_vec();
    sig_bytes.push(EcdsaSighashType::All.to_u32() as u8);

    Ok(sig_bytes)
}
```

### 4.2 Sighash 類型

Sighash 類型控制簽名涵蓋交易的哪些部分，提供了靈活的簽名選項：

**SIGHASH_ALL（0x01）**：最常見，簽名涵蓋所有輸入和輸出。任何改變都會使簽名無效。

**SIGHASH_NONE（0x02）**：只簽名輸入，不簽輸出。簽名者同意花費這些輸入，但不關心資金去向。這很危險，因為任何人都可以修改輸出。

**SIGHASH_SINGLE（0x03）**：簽名所有輸入和同一索引的輸出。用於某些特殊的多方協議。

**ANYONECANPAY（0x80）**：可以與上述任何類型組合。只簽名當前輸入，允許其他人添加更多輸入。這可以用於眾籌——多人可以各自添加輸入到同一筆交易。

```rust
fn sighash_types_demo() {
    // 不同 sighash 類型的用例

    // ALL：標準支付
    // "我同意花費這些輸入，將資金發送到這些輸出"

    // NONE：簽名授權
    // "我授權花費這些輸入，任何人可以決定去向"

    // SINGLE：交換
    // "我願意用我的輸入換取這個特定的輸出"

    // ALL|ANYONECANPAY：眾籌
    // "如果達成這個輸出，我願意貢獻我的輸入"
}
```

### 4.3 Schnorr 簽名

Taproot 引入了 Schnorr 簽名（BIP340），它比 ECDSA 有多個優點：

**更小的簽名**：64 bytes，而 ECDSA 是 71-72 bytes。

**線性性**：多個簽名可以聚合成一個。這意味著 n-of-n 多簽可以表現得像單簽，大大提高隱私和效率。

**批量驗證**：多個簽名可以同時驗證，比逐個驗證更快。

**更簡單的安全證明**：Schnorr 的數學結構更簡潔。

```rust
use bitcoin::secp256k1::{Keypair, XOnlyPublicKey};

fn schnorr_signing(
    tx: &Transaction,
    input_index: usize,
    prevouts: &[TxOut],
    keypair: &Keypair,
) -> anyhow::Result<Vec<u8>> {
    let secp = Secp256k1::new();

    // 計算 Taproot sighash
    let prevouts = Prevouts::All(prevouts);
    let mut sighash_cache = SighashCache::new(tx);
    let sighash = sighash_cache.taproot_key_spend_signature_hash(
        input_index,
        &prevouts,
        TapSighashType::Default,
    )?;

    // Schnorr 簽名
    let msg = Message::from_digest_slice(sighash.as_byte_array())?;
    let signature = secp.sign_schnorr(&msg, keypair);

    // Schnorr 簽名固定 64 bytes
    Ok(signature.as_ref().to_vec())
}
```

### 4.4 Taproot 簽名的兩種路徑

Taproot 交易可以通過兩種方式花費：

**密鑰路徑（Key Path）**：如果你控制內部密鑰（或聚合密鑰），只需提供一個 Schnorr 簽名。這是最有效率的方式，witness 只包含一個 64-byte 簽名。

**腳本路徑（Script Path）**：揭示並執行腳本樹中的一個腳本。witness 包含：
1. 滿足腳本的數據（如簽名）
2. 腳本本身
3. Control block（包含內部公鑰和 Merkle 證明）

```rust
fn taproot_spending_demo() {
    // Key path spending
    // witness: [schnorr_signature]
    // 最簡潔，64 bytes

    // Script path spending
    // witness: [script_args...] [script] [control_block]
    // 較大，但允許複雜條件
}
```

---

## 5. Miniscript

### 5.1 為什麼需要 Miniscript

直接編寫 Bitcoin Script 是容易出錯的。腳本可能看起來正確但有微妙的 bug——例如，忘記了 `OP_CHECKMULTISIG` 的佔位 bug，或者條件分支不完整。更糟糕的是，很難分析一個腳本的所有可能花費方式。

Miniscript 解決了這些問題。它是 Bitcoin Script 的一個子集，具有以下特點：

**可組合性**：你可以安全地組合不同的條件，而不用擔心它們之間的交互。

**可分析性**：給定一個 Miniscript，你可以自動分析：所有可能的花費方式、每種方式的 witness 大小、涉及的公鑰和時間鎖。

**編譯優化**：從高階策略語言編譯為最優的 Script。

### 5.2 策略語言

Miniscript 使用一種簡潔的策略語言來描述花費條件：

- `pk(KEY)` - 需要 KEY 的簽名
- `older(N)` - 相對時間鎖，N 個區塊後
- `after(N)` - 絕對時間鎖
- `sha256(H)` - 需要 SHA256 原像
- `and(A, B)` - 需要 A 和 B 同時滿足
- `or(A, B)` - A 或 B 其中之一
- `thresh(k, A, B, C...)` - k-of-n 條件

例如，`or(pk(Alice), and(pk(Bob), older(144)))` 表示：Alice 可以立即花費，或者 Bob 在 144 個區塊（約 1 天）後可以花費。

```rust
use miniscript::policy::Concrete;
use miniscript::Segwitv0;

fn miniscript_demo() -> anyhow::Result<()> {
    let alice = "02alice...";
    let bob = "02bob...";

    // 定義策略
    let policy_str = format!(
        "or(pk({}),and(pk({}),older(144)))",
        alice, bob
    );

    // 解析策略
    let policy = Concrete::<PublicKey>::from_str(&policy_str)?;

    // 編譯為 Miniscript
    let miniscript = policy.compile::<Segwitv0>()?;

    // 獲取 Script
    let script = miniscript.encode();

    println!("策略: {}", policy);
    println!("Miniscript: {}", miniscript);
    println!("Script 大小: {} bytes", script.len());

    Ok(())
}
```

### 5.3 描述符（Descriptors）

描述符是錢包軟體用來描述地址生成方式的標準格式。它們結合了腳本類型和密鑰資訊：

- `pkh(KEY)` - P2PKH 地址
- `wpkh(KEY)` - P2WPKH 地址
- `sh(wpkh(KEY))` - P2SH-P2WPKH
- `tr(KEY)` - 簡單 P2TR
- `wsh(multi(2,KEY1,KEY2,KEY3))` - 2-of-3 P2WSH 多簽

描述符可以包含 HD 派生路徑，允許錢包批量生成地址：

```
wpkh([fingerprint/84'/0'/0']xpub.../0/*)
```

這表示：使用 BIP84 路徑派生的擴展公鑰，生成接收地址（/0/*）。

---

## 6. 進階腳本技巧

### 6.1 時間鎖

時間鎖是 Bitcoin 腳本的重要功能，允許資金只能在特定時間後被花費。

**CHECKLOCKTIMEVERIFY（CLTV）**實現絕對時間鎖。值小於 5 億被解釋為區塊高度，大於等於 5 億被解釋為 Unix 時間戳。

**CHECKSEQUENCEVERIFY（CSV）**實現相對時間鎖，從 UTXO 被創建開始計算。這對於閃電網路等協議至關重要。

```rust
fn timelock_script(pubkey: &PublicKey, blocks: i64) -> ScriptBuf {
    // <blocks> OP_CSV OP_DROP <pubkey> OP_CHECKSIG
    Builder::new()
        .push_int(blocks)
        .push_opcode(OP_CSV)
        .push_opcode(OP_DROP)
        .push_key(pubkey)
        .push_opcode(OP_CHECKSIG)
        .into_script()
}
```

### 6.2 HTLC（哈希時間鎖合約）

HTLC 是閃電網路和原子交換的基礎。它允許有條件的支付：如果接收者在時限內揭示原像（preimage），可以領取資金；否則發送者可以取回。

```rust
fn htlc_script(
    recipient_pubkey: &XOnlyPublicKey,
    sender_pubkey: &XOnlyPublicKey,
    payment_hash: &[u8],
    timeout: i64,
) -> ScriptBuf {
    // IF
    //   OP_SHA256 <hash> OP_EQUALVERIFY <recipient> OP_CHECKSIG
    // ELSE
    //   <timeout> OP_CLTV OP_DROP <sender> OP_CHECKSIG
    // ENDIF

    Builder::new()
        .push_opcode(OP_IF)
            .push_opcode(OP_SHA256)
            .push_slice(payment_hash)
            .push_opcode(OP_EQUALVERIFY)
            .push_x_only_key(recipient_pubkey)
            .push_opcode(OP_CHECKSIG)
        .push_opcode(OP_ELSE)
            .push_int(timeout)
            .push_opcode(OP_CLTV)
            .push_opcode(OP_DROP)
            .push_x_only_key(sender_pubkey)
            .push_opcode(OP_CHECKSIG)
        .push_opcode(OP_ENDIF)
        .into_script()
}
```

### 6.3 Taproot 腳本樹

Taproot 允許將多個腳本組織成 Merkle 樹。每個葉子是一個獨立的花費條件。當使用某個腳本花費時，只需揭示該腳本和 Merkle 證明，其他腳本保持隱藏。

這種設計特別適合有多個備用花費方式的場景。例如，一個「金庫」可能有：
- 密鑰路徑：擁有者的正常花費
- 腳本 A：緊急恢復密鑰
- 腳本 B：延遲後的繼承人

```rust
fn taproot_tree_demo() -> anyhow::Result<()> {
    let secp = Secp256k1::new();
    let internal_key = XOnlyPublicKey::from_str("...")?;

    // 創建腳本
    let emergency_script = create_emergency_script(&emergency_key);
    let inheritance_script = create_inheritance_script(&heir_key, 52560); // ~1年

    // 構建樹
    let taproot = TaprootBuilder::new()
        .add_leaf(1, emergency_script)?
        .add_leaf(1, inheritance_script)?
        .finalize(&secp, internal_key)?;

    // 正常使用：key path（單簽名）
    // 緊急情況：script path A
    // 繼承：script path B（需要等待）

    Ok(())
}
```

---

## 7. 實戰：完整的 HTLC 交易

讓我們將所有概念結合起來，實現一個完整的 HTLC 交易流程。

```rust
fn htlc_transaction_flow() -> anyhow::Result<()> {
    let secp = Secp256k1::new();

    // 參與者
    let sender = Keypair::new(&secp, &mut rand::thread_rng());
    let recipient = Keypair::new(&secp, &mut rand::thread_rng());

    // 創建 preimage 和 hash
    let preimage = b"this is the secret";
    let payment_hash = sha256::Hash::hash(preimage);

    // 構建 HTLC Taproot

    // 成功路徑
    let success_script = Builder::new()
        .push_opcode(OP_SHA256)
        .push_slice(payment_hash.as_byte_array())
        .push_opcode(OP_EQUALVERIFY)
        .push_x_only_key(&recipient.x_only_public_key().0)
        .push_opcode(OP_CHECKSIG)
        .into_script();

    // 退款路徑（100 區塊後）
    let refund_script = Builder::new()
        .push_int(100)
        .push_opcode(OP_CSV)
        .push_opcode(OP_DROP)
        .push_x_only_key(&sender.x_only_public_key().0)
        .push_opcode(OP_CHECKSIG)
        .into_script();

    // 構建 Taproot（sender 作為內部密鑰）
    let taproot = TaprootBuilder::new()
        .add_leaf(1, success_script.clone())?
        .add_leaf(1, refund_script.clone())?
        .finalize(&secp, sender.x_only_public_key().0)?;

    let htlc_address = Address::p2tr_tweaked(
        taproot.output_key(),
        Network::Testnet
    );

    println!("HTLC 地址: {}", htlc_address);

    // ... 創建資金交易 ...

    // 成功花費（知道 preimage）
    // witness: [signature] [preimage] [script] [control_block]

    // 退款花費（超時後）
    // witness: [signature] [script] [control_block]
    // 並且 nSequence >= 100

    Ok(())
}
```

---

## 8. 總結

本篇深入探討了 Bitcoin Script 和簽名機制。我們學習了：

- **Script 基礎**：堆疊執行模型、操作碼、腳本構建
- **標準腳本類型**：從 P2PKH 到 Taproot 的演進
- **多重簽名**：傳統多簽和 Taproot 時代的選擇
- **簽名機制**：ECDSA、Schnorr 和各種 sighash 類型
- **Miniscript**：安全、可分析的腳本開發
- **進階技巧**：時間鎖、HTLC、Taproot 腳本樹

關鍵要點：
- Script 定義了資金的花費條件
- Schnorr 簽名提供了更小的簽名和聚合能力
- Taproot 結合了效率和靈活性
- Miniscript 使腳本開發更安全

下一篇將探討進階應用，包括與 Bitcoin 節點互動、完整的錢包開發和實際部署考量。

---

## 參考資源

### BIP 文檔
- [BIP 340: Schnorr Signatures](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)
- [BIP 341: Taproot](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki)
- [BIP 342: Tapscript](https://github.com/bitcoin/bips/blob/master/bip-0342.mediawiki)
- [BIP 380-386: Descriptors](https://github.com/bitcoin/bips/blob/master/bip-0380.mediawiki)

### Miniscript 資源
- [Miniscript 官網](https://bitcoin.sipa.be/miniscript/)
- [rust-miniscript](https://github.com/rust-bitcoin/rust-miniscript)
