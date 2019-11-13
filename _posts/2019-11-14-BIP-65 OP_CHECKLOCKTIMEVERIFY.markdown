---
layout: post
title:  "BIP-65 OP_CHECKLOCKTIMEVERIFY"
date:   2019-11-14
categories: news
description: "該 OPCode 允許交易輸出在未來的某個點之前變得不可花費。"
image: '/img/135.jpg'
published: true
hero_image: /img/hero.png
---

[原文](http://gavinzhang.work/blockchain/%E6%AF%94%E7%89%B9%E5%B8%81/BIP-65%20OP-CHECKLOCKTIMEVERIFY.html):BIP-65 OP_CHECKLOCKTIMEVERIFY      
該BIP為比特幣 script 系統描述了一個新的 OPCode （`OP_CHECKLOCKTIMEVERIFY`），該 OPCode 允許交易輸出在未來的某個點之前變得不可花費。

## 概要

**CHECKLOCKTIMEVERIFY重新定義了現有的`NOP2` OPCode (其實就是`OP_CHECKLOCKTIMEVERIFY`指令替換了`OP_NOP2`指令)。執行時，如果以下任何一個條件成立，則 OPCode 直譯器將以錯誤終止：**

* 堆棧是空的;
* 堆棧中的頂層項目小於0;
* 頂層堆棧項的鎖定時間類型（高度vs.時間戳）與`nLockTime`欄位不同;
* 頂部堆棧項大於交易的`nLockTime`欄位;
* `txin`（交易輸入）的`nSequence`欄位是`0xffffffff`;

否則， OPCode 執行將繼續，如同NOP執行一樣。

交易中的`nLockTime`欄位可防止交易被挖出，直到達到某個區塊高度或區塊時間為止。通過將傳給`CHECKLOCKTIMEVERIFY`的參數與`nLockTime`欄位進行比較，我們間接驗證是否已達到所需的區塊高度或區塊時間; 直到該區塊高度或區塊時間已經達到，交易輸出仍然不可花費。

## 動機

交易中的`nLockTime`欄位可用於證明 將來可以花費這筆交易輸出，方法是構造一個有效的交易開銷，並對`nLockTime`欄位進行設定。

然而，`nLockTime`欄位不能證明在未來的某個時間內不可能花費交易輸出，因為無法知道是否建立了支出該輸出的其他交易的有效簽名。

## 第三方託管

**如果Alice和Bob聯合經營一家企業，他們可能希望確保所有資金都儲存在需要雙方同時批准的2-of-2的多重（多重簽名的交易）交易輸出中。但是，他們發現在特殊情況下，例如任何一個人受到“嚴重的車禍”，他們都需要備用的方法，繼續動用該筆資金。因此，他們任命他們的律師Lenny擔任第三方。**

在任何時候，Lenny隨時可以同Alice或Bob一起串謀非法竊取資金。同樣，Lenny可能更願意不竊取資金，以阻止不良行為者企圖強行從他那裡獲取secret keys 。

但是，使用`CHECKLOCKTIMEVERIFY`可以將資金儲存在以下格式的scriptPubKeys中：

```
IF
    <now + 3 months> CHECKLOCKTIMEVERIFY DROP
    <Lenny's pubkey> CHECKSIGVERIFY
    1
ELSE
    2
ENDIF
<Alice's pubkey> <Bob's pubkey> 2 CHECKMULTISIG
```

在任何時候，資金都可以用下面的 OPCode 來支付：
```
0 <Alice's signature> <Bob's signature> 0
```
Lenny經過3個月後，Alice或Bob中的一個可以用以下 OPCode 支付資金：
```
0 <Alice/Bob's signature> <Lenny's signature> 1
```
## 非交互式定期退款 | Non-interactive time-locked refunds

存在許多協議，其中建立交易輸出，這需要雙方的合作來花費輸出。為確保一方的失敗不會導致資金損失，退款交易使用`nLockTime`提前設定。這些退款交易需要互動式建立，此外，目前易受交易延展性影響。`CHECKLOCKTIMEVERIFY`可用於這些協議，用非互動式設定取代互動式設定，另外，使交易延展性不成問題。

### 雙因素錢包 | Two-factor wallets

諸如GreenAddress之類的服務將比特幣儲存為 2-of-2 的多重簽名 OPCode ScriptPubKey，使得一個金鑰對由使用者控制，另一個金鑰對由服務控制。為了花費資金，使用者使用本地安裝的生成所需簽名之一的錢包軟體，然後使用雙因素身份驗證方法來授權該服務建立第二個`SIGHASH_NONE`簽名，該簽名在將來的某個時間被鎖定，並向用戶傳送該儲存簽名。如果使用者需要花費資金並且服務不可用，他們會等到`nLockTime`過期。

問題是，在許多情況下，使用者將不會擁有一些或全部交易輸出的有效簽名。使用`CHECKLOCKTIMEVERIFY`而不是按需建立退款簽名，而是使用以下形式的scriptPubKeys：

```
IF
    <service pubkey> CHECKSIGVERIFY
ELSE
    <expiry time> CHECKLOCKTIMEVERIFY DROP
ENDIF
<user pubkey> CHECKSIG
```

現在，用戶總是可以通過等待到期時間來花費他們的資金而無需服務的合作。

### 支付通道 | Payment Channels

傑里米·斯皮爾曼（Jeremy Spilman）style 的支付通道首先設定一個存款，由2-of-2的多重簽名， tx1 控制的存款，然後調整第二個交易 tx2 ，將 tx1 的輸出用於支付者和收款者。在釋出 tx1 之前，建立一個退款交易 tx3 ，確保收款人消失時付款人可以取回其押金。當前創建退款交易的過程容易受到交易延展性攻擊的影響，此外，還要求付款人儲存退款。使用與雙因素錢包示例中相同的scriptPubKey形式可以解決這兩個問題。

## 發布數據的無信任付款 | Trustless Payments for Publishing Data

The PayPub protocol makes it possible to pay for information in a trustless way by first proving that an encrypted file contains the desired data, and secondly crafting scriptPubKeys used for payment such that spending them reveals the encryption keys to the data. However the existing implementation has a significant flaw: the publisher can delay the release of the keys indefinitely.

This problem can be solved interactively with the refund transaction technique; with CHECKLOCKTIMEVERIFY the problem can be non-interactively solved using scriptPubKeys of the following form:

---

通過首先證明加密文件包含所需的數據，然後製作用於支付的scriptPubKeys以便使它們花費來顯示數據的加密密鑰，PayPub協議可以以不信任的方式支付信息。但是，現有的實現存在一個重大缺陷：發布者可以無限期地延遲密鑰的發布。

這個問題可以用退款交易技術互動地解決; 使用`CHECKLOCKTIMEVERIFY`，可以使用以下形式的scriptPubKeys以非互動方式解決問題：

```
IF
    HASH160 <Hash160(encryption key)> EQUALVERIFY
    <publisher pubkey> CHECKSIG
ELSE
    <expiry time> CHECKLOCKTIMEVERIFY DROP
    <buyer pubkey> CHECKSIG
ENDIF
```

**資料的買家現在正在提供一個有效期限的安全報價。如果發行商在到期時間到期之前未能接受報價，買家可以通過消費輸出來取消報價。**

## 證明犧牲礦工的手續費 | Proving sacrifice to miners' fees

Proving the sacrifice of some limited resource is a common technique in a variety of cryptographic protocols. Proving sacrifices of coins to mining fees has been proposed as a universal public good to which the sacrifice could be directed, rather than simply destroying the coins. However doing so is non-trivial, and even the best existing technqiue - announce-commit sacrifices - could encourage mining centralization. CHECKLOCKTIMEVERIFY can be used to create outputs that are provably spendable by anyone (thus to mining fees assuming miners behave optimally and rationally) but only at a time sufficiently far into the future that large miners can't profitably sell the sacrifices at a discount.

---

證明犧牲一些有限的資源是各種密碼協議中的常用技術。已經提出了證明將硬幣犧牲為採礦費的做法，作為犧牲品可以針對的一種普遍的公共物品，而不是簡單地銷毀硬幣。但是，這樣做並非易事，即使是現有的最佳技術-宣布承諾犧牲-也會鼓勵採礦業的集中化。 `CHECKLOCKTIMEVERIFY`可用於創建任何人都可證明可使用的輸出（因此，假設礦工的行為合理且合理，則要收取採礦費），但前提是在足夠遠的將來，大型礦工無法以折扣價出售利潤。

證明犧牲一些有限的資源是各種密碼協議中的常見技術。已經提出將幣的犧牲證明為挖礦手續費，作為犧牲可以指向的普遍公共物品，而不是簡單地摧毀幣。然而，這樣做並非微不足道，即使是最好的現有技術 - 宣佈 - 承諾 - 也會鼓勵礦業集中。`CHECKLOCKTIMEVERIFY`可用於建立任何人都可以花費的產出（因此，假設礦工的行為是理想的和理性的，那麼開採費），但只有在未來足夠遠的時間，大型礦工才能以折扣銷售犧牲品。

## 凍結資金 | Freezing Funds

除了使用冷儲存，硬體錢包和P2SH multisig輸出來控制資金之外，現在資金可以直接在區塊鏈中凍結在UTXO中。使用下面的scriptPubKey，在提供的失效時間之前，沒有人能夠使用安全輸出。這種可靠地凍結資金的能力在需要減少脅迫或沒收風險的情況下可能會有用。
```
<expiry time> CHECKLOCKTIMEVERIFY DROP DUP HASH160 <pubKeyHash> EQUALVERIFY CHECKSIG
```
## 完全替換nLockTime欄位 | Replacing the nLockTime field entirely

另外，請注意如果`SignatureHash()`演算法可以選擇覆蓋 OPCode 的一部分，那麼簽名可能會要求 OPCode Sig包含`CHECKLOCKTIMEVERIFY` OPCode ，並且還需要執行它們。（CODESEPARATOR OPCode 非常接近於在比特幣的v0.1中實現這一點）。這種每簽名功能可以完全取代每個交易的`nLockTime`欄位，因為有效簽名現在可以證明交易輸出可以花費。

## 詳細規格 | Detailed Specification


參考下面轉載的參考實現，瞭解這些語義的精確語義和詳細基本原理。
```
case OP_NOP2:
case OP_NOP2:
{
    // CHECKLOCKTIMEVERIFY
    //
    // (nLockTime -- nLockTime )

    if (!(flags & SCRIPT_VERIFY_CHECKLOCKTIMEVERIFY))
        break; // not enabled; treat as a NOP

    if (stack.size() < 1)
        return false;

    // Note that elsewhere numeric opcodes are limited to
    // operands in the range -2**31+1 to 2**31-1, however it is
    // legal for opcodes to produce results exceeding that
    // range. This limitation is implemented by CScriptNum's
    // default 4-byte limit.
    //
    // If we kept to that limit we'd have a year 2038 problem,
    // even though the nLockTime field in transactions
    // themselves is uint32 which only becomes meaningless
    // after the year 2106.
    //
    // Thus as a special case we tell CScriptNum to accept up
    // to 5-byte bignums, which are good until 2**32-1, the
    // same limit as the nLockTime field itself.
    const CScriptNum nLockTime(stacktop(-1), 5);

    // In the rare event that the argument may be < 0 due to
    // some arithmetic being done first, you can always use
    // 0 MAX CHECKLOCKTIMEVERIFY.
    if (nLockTime < 0)
        return false;

    // There are two types of nLockTime: lock-by-blockheight
    // and lock-by-blocktime, distinguished by whether
    // nLockTime < LOCKTIME_THRESHOLD.
    //
    // We want to compare apples to apples, so fail the script
    // unless the type of nLockTime being tested is the same as
    // the nLockTime in the transaction.
    if (!(
            (txTo.nLockTime <  LOCKTIME_THRESHOLD && nLockTime <  LOCKTIME_THRESHOLD) ||
            (txTo.nLockTime >= LOCKTIME_THRESHOLD && nLockTime >= LOCKTIME_THRESHOLD)
            ))
        return false;

    // Now that we know we're comparing apples-to-apples, the
    // comparison is a simple numeric one.
    if (nLockTime > (int64_t)txTo.nLockTime)
        return false;

    // Finally the nLockTime feature can be disabled and thus
    // CHECKLOCKTIMEVERIFY bypassed if every txin has been
    // finalized by setting nSequence to maxint. The
    // transaction would be allowed into the blockchain, making
    // the opcode ineffective.
    //
    // Testing if this vin is not final is sufficient to
    // prevent this condition. Alternatively we could test all
    // inputs, but testing just this input minimizes the data
    // required to prove correct CHECKLOCKTIMEVERIFY execution.
    if (txTo.vin[nIn].IsFinal())
        return false;

    break;

}
```
https://github.com/petertodd/bitcoin/commit/ab0f54f38e08ee1e50ff72f801680ee84d0f1bf4

## 部署 | Deployment

我們重用BIP66中使用的雙閾值`IsSuperMajority()`切換機制，其閾值相同，但`nVersion = 4`。新規則對於`nVersion = 4`的每個區塊（高度為H）有效，並且至少有750之前的區塊（高度為H-1000..H-1）的`nVersion >= 4`。此外，當區塊之前的1000個區塊中的950個具有`nVersion >= 4`時，`nVersion < 4`區塊將變為無效，並且全部進一步的阻止執行新的規則。

應該注意的是，BIP9涉及永久性地將高位設定為1，這導致`nVersion>=`所有先前的`IsSuperMajority()`軟分叉，因此`nVersion`中的位不會永久丟失。

## SPV客戶 | SPV Clients

儘管SPV客戶端（當前）通常無法驗證區塊，而是信任礦工對其進行驗證，但他們能夠驗證區塊頭，因此可以驗證部署規則的子集。如果達到95％閾值時，前1000個區塊中的950個中有950個具有`nVersion >= 4`，則SPV客戶端應拒絕`nVersion 4`區塊，以防止來自剩餘未升級礦工的5％的錯誤確認。

## Credits
Thanks goes to Gregory Maxwell for suggesting that the argument be compared against the per-transaction nLockTime, rather than the current block height and time.

## 參考

PayPub

* [https://github.com/unsystem/paypub](https://github.com/unsystem/paypub)

Jeremy Spilman支付通道

* [https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2013-April/002433.html](https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2013-April/002433.html)

## 實現

Python / python-bitcoinlib

* [https://github.com/petertodd/checklocktimeverify-demos](https://github.com/petertodd/checklocktimeverify-demos)

JavaScript / Node.js / bitcore

* [https://github.com/mruddy/bip65-demos](https://github.com/mruddy/bip65-demos)

## 版權 | Copyright

This document is placed in the public domain.

## 引用和參考

* [BIP65：檢查鎖定時間驗證](http://www.chidaolian.com/article-680-4)
* [bips/bip-0065.mediawiki](https://github.com/bitcoin/bips/blob/master/bip-0065.mediawiki)
