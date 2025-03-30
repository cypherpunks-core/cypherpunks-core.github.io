---
layout: post
title: 'Miniscript: 簡化 Bitcoin Scripting'
date: 2019-09-09
image: /img/miniscript1.png
description: Miniscript 是一種以結構化方式表示Bitcoin  Script 的語言，可實現高效的分析、結構(composition)、一般簽名等
published: true
hero_image: /img/hero.png
categories:
- news
tags:
- bitcoin
- miniscript
---

[原文](https://medium.com/blockstream/miniscript-bitcoin-scripting-3aeff3853620)*By Pieter Wuille & Andrew Poelstra*

![](https://miro.medium.com/max/1600/0*S7Kqs5tYkppoJQkV)

* *大綱**
- [介紹](#%e4%bb%8b%e7%b4%b9)
  - [Bitcoin Script](#bitcoin-script)
  - [難以驗證 Difficult to Verify](#%e9%9b%a3%e4%bb%a5%e9%a9%97%e8%ad%89-difficult-to-verify)
- [Miniscript](#miniscript)
- [使用案例 Use Cases](#%e4%bd%bf%e7%94%a8%e6%a1%88%e4%be%8b-use-cases)
  - [優化的Script Optimized Script](#%e5%84%aa%e5%8c%96%e7%9a%84script-optimized-script)
  - [一般支付 Generic Spending](#%e4%b8%80%e8%88%ac%e6%94%af%e4%bb%98-generic-spending)
  - [儲備證明 Proof-of-Reserves](#%e5%84%b2%e5%82%99%e8%ad%89%e6%98%8e-proof-of-reserves)
  - [支付 policy 的組成 Composition of Spending Policies](#%e6%94%af%e4%bb%98-policy-%e7%9a%84%e7%b5%84%e6%88%90-composition-of-spending-policies)
  - [動態聯盟 Dynamic Federations](#%e5%8b%95%e6%85%8b%e8%81%af%e7%9b%9f-dynamic-federations)
- [歷史](#%e6%ad%b7%e5%8f%b2)
- [相關工作](#%e7%9b%b8%e9%97%9c%e5%b7%a5%e4%bd%9c)
- [未來的工作和結論](#%e6%9c%aa%e4%be%86%e7%9a%84%e5%b7%a5%e4%bd%9c%e5%92%8c%e7%b5%90%e8%ab%96)
- [開始構建Miniscript](#%e9%96%8b%e5%a7%8b%e6%a7%8b%e5%bb%baminiscript)

![](/img/miniscript2.png)
# 介紹
## Bitcoin Script
Bitcoin 一直有一種機制，可以通過更複雜的 policy 花費coin，而不僅僅是一個 single key ：Script系統。 雖然 Script 主要用於 single-key 支付，但它也是各種 multisig 錢包、原子交換(atomic swap)結構和 Lightning Network的基礎。
![](/img/miniscript3.png)
然而，這不是它能做的全部。 Script 可用於表示發布交易所需的複雜條件 - 例如 (two of A, B, C)和(D or (E and F))，其中A到F各自代表一個唯一的 key - 以及 hash preimage 檢查、時間鎖( timelocks)和一些更奇特的結構。
![](/img/miniscript4.png)
![](/img/miniscript7.png)
![](/img/miniscript9.png)
![](/img/miniscript11.png)
## 難以驗證 Difficult to Verify
我們沒有在任何地方密切使用 Script 的全部潛能一個原因是，實際上構建 Script 重要的任務很麻煩：很難驗證它們的正確性和安全性，甚至更難找到最有效率的編寫方法。
這只是問題的一部分：即使您知道正確的 Script 設計應用程式和協議來協商和構建使用它的交易，每次設計新的構造時都需要進行大量的臨時開發工作。任何類型的靈活性通常都會採用難看的 template-matching 來檢測相容的 Script，每次添加都需要更多的工程資源來進行分析和質量保證。
如果相反 Bitcoin 應用程式可以與任何 Script 一起使用，而不僅僅是為它們設計的少數 Script，該怎麼辦？我們不會局限於使用一次性設計，並且可以根據使用者指定的要求開始設計構建和使用動態生成 Script 的應用程式。電子錢包開發者還可以引入更多基於 Script 的選項，同時保持與其他錢包的互操作性。
# Miniscript
![](/img/miniscript12.png)
* *Miniscript**，這是一種以結構化方式表示Bitcoin  Script 的語言，可實現高效的分析、結構(composition)、一般簽名等。
比如Bitcoin Script 表示法
```text
<A> OP_CHECKSIG OP_IFDUP OP_NOTIF OP_DUP OP_HASH160 <hash160(B)> OP_EQUALVERIFY OP_CHECKSIGVERIFY <144> OP_CSV OP_ENDIF
```
其中A和B是公鑰，可以轉換為 Miniscript 表示法
```text
or_d(c:pk(A),and_v(vc:pk_h(B),older(144)))
```
這種表示法明確指出，Script 的語義允許支付 when either A signs, or when B signs after 144 blocks。 可以用這種方式編寫大部分有意義的 Script。
使人類(或工程師......)可讀的 Script 只是 Miniscript 的功能之一。 其主要目的是實現對 Script 的自動推理，如下面的使用案例所示。
# 使用案例 Use Cases
今天使用 Bitcoin Script 來構建複雜的支付條件要比它需要的要困難得多，需要為每個新的使用案例 開發、測試和部署專用軟體。 Miniscript 可以通過跨越任意一組支付條件的方式來涵蓋這些案例，並且通常比專用解決方案更簡單、更可靠。
## 優化的Script Optimized Script
![](/img/miniscript10.png)
一個這樣的案例是找到實現給定的一組支付條件的最佳 Script。 在Bitcoin Script中，有許多不同的方法來請求簽名、描述連詞或分斷或實施門檻。 即使對於經驗豐富的 Bitcoin Script 開發者，正確的選擇可能取決於滿足的不同條件的相對機率，並且難以計算。 我們的[線上編譯器](http://bitcoin.sipa.be/miniscript/)，也可以[作為C ++原始碼](https://github.com/sipa/miniscript)，或作為[rust- miniscript](http://bitcoin.sipa.be/miniscript/)庫，可以立即找到與給定支付 policy 相對應的Miniscript表達式。
```text
or(99@pk(A),1@and(pk(B),older(144)))
```
引言中的例子可以通過編寫policy來獲得，該policy是一種寫作方式，即（A符號）的左側有99％的概率被採取，而右側（144個區塊之後的B符號）具有 被抓住的機率為1％。
## 一般支付 Generic Spending
一旦找到有效的 Script，Script 的許多用途的一個共同障礙是不同的支付機制之間缺乏互操作性。希望實施長期時間鎖或複雜的多重簽名要求的使用者可能會因為擔心他們的交易對手沒有(或不會)擁有軟體來識別和花費由 policy 控制的 coin 而被阻止。
Miniscript 憑藉直接代表消費條件，允許表達任意 policy ，以便任何人都可以：
1. 計算 Script 的相關地址;
2. 確定哪些簽名者在特定時間簽名是必要的或足夠的;
3. 給出足夠的簽名集，產生有效的交易。

![](/img/miniscript15.png)
使用者無需擔心所有參與者都在使用相容軟體，或者在需要此類時間時此類軟體將繼續存在。
他們也不必擔心他們的需求可能會以與他們的簽名軟體不相容的方式發生變化，從而向他們保證他們使用 Bitcoin Script 不會限制他們。
## 儲備證明 Proof-of-Reserves
與簽名問題相關的是**證明儲備**的問題，這是一個公司證明它*可以*花費一套 Bitcoin 而不實際花費它們的過程。 雖然存在這方面的工具，例如[Blockstream的儲備工具證明](https://blockstream.com/2019/02/04/en-standardizing-bitcoin-proof-of-reserves/)，但還沒有共同行業內使用的標準。 如果沒有 Miniscript，可能無法達到可以涵蓋當今使用的監管解決方案多樣性的標準。
## 支付 policy 的組成 Composition of Spending Policies
讓我們看一下受互操作性需求限制的 Bitcoin Script 開發者的具體示例。考慮一家公司託管大量Bitcoin的情況，並希望這些coin只有在大多數董事的同意下才能消費。但是，一些個人董事希望使用自己的錢包軟體和硬體，進行複雜的簽名設置，涉及跨不同裝置的多個key，並且不希望使用專用應用程式所提供的 single key 簽名的方案。
![](/img/miniscript8.png)

如果沒有 Miniscript，製作一個包含所有簽名者要求的 Script，同時向所有簽名者保證完整的 Script 完整，並且他們的錢包軟體與結果相容，則會出現一個不可逾越的問題。
使用Miniscript，這些董事可以簡單地在自己的錢包軟體中編寫 policy ，構建描述閾值要求的單個 policy ，然後將其編譯為 Miniscript。他們可以直接驗證編譯器的輸出是否與原始 policy 匹配，以及原始 policy 是否滿足每個人的要求。然後，他們可以使用任何與 Miniscript 相容的軟體來計算接收 coin 的地址，在消費時收集簽名，並將這些簽名組合成有效的交易。
作為一個簡單的假設示例：一家公司正在設置帶有兩個控制器的自定義 multisig 存儲。一位董事已經在使用Blockstream Green(配置為2-of-2，在延遲一段時間後成為1-of-2 )，另一位使用Electrum(標準1-of-1)。如果沒有允許組合安全，可互操作的Script policy 的工具，使用Green的董事就不可能將他的 policy 作為“參與者”添加到公司 multisig。如果Green和用於構建公司 multisig 的軟體都支持 Miniscript，兩位董事都可以繼續直接使用他們喜歡的錢包，而且沒有人甚至不需要知道 Script 下面有 Script。

## 動態聯盟 Dynamic Federations
Miniscript 功能的一個具體例子可以在[Blockstream的Liquid sidechain](https://blockstream.com/liquid/)中找到。目前正在開發的一項功能，內部稱為*Dynamic Federations，*允許現有的Liquid成員管理新成員的添加或更新控制聯邦保管Bitcoin 可支配性的 Script。 Miniscript 為成員提供了快速有效地構建此類 Script 的工具 - 事實上，Miniscript 編譯器發現了現有[LiquidScript](https://www.blockstream.info/address/3EiAcrzq1cELXScc98KeCswGWZaPGceT1d)的 22-byte 縮短版本，與原始的，精心手工優化的 Script 相比省5％。但更重要的是，它允許成員自動驗證建議 Script 的重要屬性，減少成員之間相互協調的需要，或者對提議的 Script 執行昂貴的手動安全審核。
特別是，成員可以自動驗證任何 Script 提議包括：
1. 他們自己的 key;
2. 一個時間緊迫的緊急支付條件，在未來是正確和充分的。(原文：a timelocked emergency spending condition that is correct and sufficiently far in the future.)

它還允許他們驗證新聯盟中的參與者是否能夠花費由舊聯盟控制的 coin。這種檢查對於確保轉換不會導致 coin 丟失至關重要，即使對於在轉換時將 coin 移入系統的使用者來說也是如此，如果沒有 Miniscript，這幾乎是不可能的。
# 歷史
Miniscript的概念在2018年夏天湊在一起，成為當時正在開發的幾個想法的熱潮。 7月中旬，Pieter Wuille 向 Bitcoin Core引入了輸出描述符，這是一種描述 Core 支持的眾多不同地址類型的通用方法。同時，部分簽名 Bitcoin 交易(PSBT，在[BIP 174](https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki)中描述)，由Andy Chow開發的錢包互操作性協議，當時那個夏天他在Blockstream實習時，正在錢包領域越來越受歡迎。
![](/img/miniscript13.png)
PSBT的一個重要組成部分是*終結者(finalizer)*，參與者根據PSBT中包含的簽名者數據集合匯總實際的 Bitcoin 交易。這個程序集需要理解要滿足的 Script，這意味著PSBT支持的錢包執行非常重要的事情必須實現自己的專用終結器，需要冗餘開發和限制互操作性。
![](/img/miniscript14.png)
Blockstream 的 Andrew Poelstra 正在努力接受[實施PSBT](https://github.com/rust-bitcoin/rust-bitcoin/pull/103)for rust-bitcoin，一種用於Rust編程語言的通用Bitcoin庫。這樣的實現是由Carl Dong提出的，但沒有包括足以支持圖書館所有使用者的終結器。 Poelstra [在IRC上觀察](http://gnusha.org/rust-bitcoin/2018-07-31.log)“如果你有高度結構化的Script模板，你可以逃脫而不是真正理解 Script”，這個想法是成為Miniscript的核心。
無關緊要的是，Poelstra 和 Wuille 一直致力於一個與監管相關的項目，並且由於缺乏可用於復雜多參與者 Script 的標準工具而感到沮喪。兩人在2018年8月開會討論這個問題.Vuille建議將這些“高度結構化的 Script模板”作為Bitcoin Core輸出描述符的擴展。
隨著擴展的形成，它被分成 Bitcoin Script 的結構化子集，它成為Miniscript，以及直接表示支付條件的簡單“ policy 語言”，可以編譯為 Miniscript。 2019年1月，[Wuille在史丹佛區塊鏈會議上提交了初步結果](https://www.youtube.com/watch?v=XM1lzN4Zfks)。
接下來的五月，Sanket Kanjalkar 加入 Blockstream 進行為期三個月的實習，專注於為 Miniscript 實施工具並幫助將其與 Bitcoin Core 集成。在他的幫助下，Miniscript被完全重複地重新設計為更小，更高效，更易於分析，並且更好地防止延展性。最後一組更改是根據Bitcoin共識和標準規則驗證大量隨機 Miniscript 相容 Script。這些迭代的結果是今天的 Miniscript。
# 相關工作
Miniscript 構建於 Bitcoin 生態系統的許多其他項目之上並與之集成。特別是，如上所述，Miniscript 擴展了 Bitcoin Core的錢包的**輸出描述符**和補充**PSBT**以啟用完全通用的更新程序和終結器。
![](/img/miniscript5.png)
Miniscript可以[與**Ivy**相比](https://mobile.twitter.com/danrobinson/status/1091149043563036672)，這是另一種旨在使 Bitcoin Script的高級功能可訪問的語言。然而，當Ivy 編譯為 Script時，Miniscript 是一個(子集) Script 的直接表示，這意味著“miniscripts”的正確性和健全性可以通過計算有效地驗證。 Miniscript也適用於許多其他形式的靜態分析，無論是Script還是Ivy。
![](/img/miniscript6.png)
Miniscript的 policy 語言類似於Ivy，因為兩者都是抽象，必須編譯成(Mini)Script以便在區塊鏈上使用。但是，Miniscript的 policy 語言在結構上類似於Miniscript本身，因此可以輕鬆驗證編譯器的輸出以匹配編譯器的輸入 - 實際上，甚至可以手動檢查 - 並且可以輕鬆驗證以符合使用者的期望。
與Miniscript相關的另一種區塊鏈語言是 Blockstream 的 **Simplicity** 。與Miniscript一樣，[Simplicity是一種旨在直接嵌入區塊鏈交易中的低級語言](https://blockstream.com/2018/11/28/en-simplicity-github/)。與Miniscript一樣，Simplicity支持許多形式的靜態分析，這些靜態分析在部署區塊鏈合同時至關重要，但在以太網的EVM等替代方案中設計非常困難或不可能。
與Simplicity相比，它非常強大，足以表達任何可計算的函數，Miniscript的範圍非常有限：它可以表達簽名要求、時間鎖， hash preimages 以及這些的任意組合。範圍的縮小使得Miniscript更容易推理它涵蓋的使用案例，更重要的是，它允許它在現有的Bitcoin區塊鏈上工作。相比之下，Simplicity 是對Bitcoin Script的徹底背離，並且仍然處於其發展的早期階段。
# 未來的工作和結論
在設計 Miniscript 時，我們開始使 Bitcoin Script 更易於訪問。 雖然很多工作都集中在研究和提出 Script 和 Bitcoin 共識規則的未來變化以增加額外功能，但我們認為甚至使用已經存在的通用、安全、可組合和可互操作的方式的功能也缺少基礎設施。
![](/img/miniscript16.png)
這項工作尚未完成。 我們有Miniscript(C ++和Rust)和 policy 編譯器的兩個功能實現，但是為了使這個技術可訪問，我們需要集成在常用的軟體中。 通過與 Miniscript 相容的 PSBT 實現(更新程序和終結程序)，即使沒有明確的支持，許多 PSBT 簽名者(包括基於硬體錢包的簽名者)也可以用於復雜的 Script。 編譯器也可以進行改進，因為 policy 中有許多優化來編寫尚未考慮的轉換 Script。
![](/img/miniscript17.png)
在此過程中，我們學到了很多東西：
* **Script資源限制使 policy 優化變得複雜**：大量的共識和標準強加的資源限制(最大操作碼，最大 Script 大小，最大堆棧大小......)使得為給定 policy 找到最佳 Script 變得更加困難一旦接近達到這些限制。這是一個有趣的見解，因為它可能指導未來對 Script 的建議改進。相關地，我們也驚訝地發現Bitcoin共識規則實際上計算了參與執行的“OP_CHECKMULTISIG(VERIFY)”的鍵的數量，朝向每個Script限制的201個非推送操作碼。
* **可變見證規模使費用估算變得複雜**：簡單支付和multisig構造的見證大小獨立於存在的確切密鑰集。 一旦我們轉向更複雜的Script，見證大小變得可變，並且可能使費用估算複雜化。 針對特定交易輸出的預期簽名者可能需要樂觀地猜測將採用廉價路徑，並構建相應的交易。 如果不是該路徑的所有鍵或散列最終都可用，則可能需要更改事務本身以考慮增加的手續費。
* **Segwit的堆棧編碼使優化變得複雜**：由於 Segwit 輸入堆棧不再編碼為Script，而是直接編碼為堆棧元素列表。這有一個令人遺憾的副作用，即將“true”的編碼從1 byte更改為2 byte。因此，Miniscript需要關注哪些子表達式進入IF / ELSE / ENDIF結構的哪一側。
* **可擴展性**：自Segwit以來，交易延展性不再是協議正確性的交易破壞者，但它可能仍會產生不良影響(例如傳播交易時費率的不確定性，減緩緊湊塊傳播，並且干擾哈希鎖的使用是全局發布機制。由於這些原因，我們在設計Miniscript時考慮到了非延展性，並學會瞭如何推斷證人一般的不可塑性。為了實現這一點，Miniscript依賴於某些特定於Segwit的規則，因為在Segwit之前的交易規則中實現非可延展性非常麻煩。
* **常見的子表達式消除很難**：儘管有各種嘗試，但Miniscript不支持優化重複的子表達式。雖然在某些特定情況下這是可能的，但在Script中通常很難做到這一點。添加某些堆棧操作操作碼可能會改變這種情況。
# 開始構建Miniscript
有興趣使用Miniscript的開發者可以首先使用[我們的線上編譯器和分析器](http://bitcoin.sipa.be/miniscript/)探索Miniscript結構。 您可能還想查看我們的一些[rust-miniscript用法示例](https://github.com/apoelstra/rust-miniscript/tree/master/examples)。
在[C ++ miniscript](https://github.com/sipa/miniscript)和[rust-miniscript](https://github.com/apoelstra/rust-miniscript/)GitHub存儲庫，以及您的貢獻非常受歡迎 經常可以在Freenode的IRC ## miniscript上看到我們的團隊進行與miniscript相關的討論！
