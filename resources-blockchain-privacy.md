---
title: 區塊鏈隱私資源 
subtitle: Blockchain privacy resources
layout: page
# callouts: home_callouts
# hide_hero: true
hero_image: /img/hero.png
show_sidebar: true
---

[**倉庫位置**](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh)

[![](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/raw/master/Blockchain-and-privacy.jpg)](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/blob/master/Blockchain-and-privacy.jpg)

主要參考：

* ***[Bitcoin Core 中的隱私](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/blob/master/bitcoincore-privacy.md)***
* ***[Privacy Technologies](https://messari.io/resource/privacy-technologies)***

## 目錄  Contents

- [目錄 Contents](#%e7%9b%ae%e9%8c%84-contents)
- [概觀 Overview](#%e6%a6%82%e8%a7%80-overview)
- [背景 Background](#%e8%83%8c%e6%99%af-background)
- [機密交易 Confidential Transactions](#%e6%a9%9f%e5%af%86%e4%ba%a4%e6%98%93-confidential-transactions)
- [零知識證明 Zero Knowledge Proofs](#%e9%9b%b6%e7%9f%a5%e8%ad%98%e8%ad%89%e6%98%8e-zero-knowledge-proofs)
- [環簽名 Ring Signatures](#%e7%92%b0%e7%b0%bd%e5%90%8d-ring-signatures)
- [MimbleWimble](#mimblewimble)
- [蒲公英 Dandelion](#%e8%92%b2%e5%85%ac%e8%8b%b1-dandelion)
- [防彈 Bulletproofs](#%e9%98%b2%e5%bd%88-bulletproofs)
- [其他文章 Other articles](#%e5%85%b6%e4%bb%96%e6%96%87%e7%ab%a0-other-articles)

## 概觀  Overview

隱私技術將成為加密設備領域最重要的部分之一。我們已經編制了一系列資源，介紹了機密交易，MimbleWimble，環簽名和零知識證明等概念。 

## 背景  Background

對使用比特幣和其他數字資產的更多私密，機密，秘密和匿名方式的需求日益增長，這促使各種協議和應用程序開發人員發布改進和提供更好隱私的產品。

* 描述區塊鏈交易的隱私，機密性，匿名性和保密性之間的差異
  * [走向隱私，保密，匿名和保密的概念方法](https://medium.com/beam-mw/toward-a-conceptual-approach-to-privacy-confidentiality-anonymity-and-secrecy-ea372e396240) - Beni Issembert
* 探討增加比特幣交易隱私的社會和政治論點
  * [比特幣協議中對隱私增強的需求](https://messari.io/resource/privacy-technologies) - 克里斯斯圖爾特
* 初學者指導了解“隱私硬幣”是什麼以及它們為何重要
  * [隱私硬幣：什麼是RingCT，CoinJoin和zk-Snarks？](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/blob/master)(初學者指南，了解“隱私硬幣”是什麼以及它們為何重要)
* 區塊鏈隱私實驗調查主要集中在：隱私硬幣，智能合約隱私，隱私基礎設施和隱私研究
  * [隱秘資料隱私概述](https://thecontrol.co/an-overview-of-privacy-in-cryptocurrencies-893dc078d0d7) - Richard Chen
* 關於開發商和投資者應如何理解加密經濟系統中的隱私的兩部分系列摘要
  * [“密碼”中的隱私：概述](https://medium.com/@yi.sun/privacy-in-cryptocurrencies-d4b268157f6c) - 易孫和張燕
  * [Cryptocurrencies中的隱私：基於混合的方法](https://medium.com/@yi.sun/privacy-in-cryptocurrencies-mixing-based-approaches-ce08d0040c88) - Yi Sun和Yan Zhang
* 討論可替代性的理論重要性及其如何應用於比特幣
  * [比特幣的攻擊向量：可變性](https://medium.com/chainrift-research/bitcoins-attack-vectors-fungibility-ed58cb4cff73) - 馬特B.
* Andreas Antonopoulos 向觀眾提出了有關即將對比特幣進行隱私改進的好處和挑戰的問題
  * [比特幣問答：政府會不會存在隱私幣？](https://www.youtube.com/watch?v=30sjEW70rLE) - Andreas Antonopoulos
* Andreas Antonopoulos向觀眾提出有關比特幣等貨幣的隱私問題和機會以及他們為新興經濟體帶來機遇的問題
  * [比特幣問答：當比特幣可追溯時，我們如何保護隱私？](https://www.youtube.com/watch?v=PaNDHsix8cs) - Andreas Antonopoulos
* 安德烈亞斯·安東諾普洛斯(Andreas Antonopoulos)向觀眾提出了關於匿名性對加密貨幣和最新隱私技術發展意味著什麼的問題
  * [比特幣問答：匿名和保密交易](https://www.youtube.com/watch?v=MgTxkoLF2KA) - Andreas Antonopoulos
* 比特幣協議的即將到來和預期的隱私和安全改進路線圖摘要
  * [比特幣發展路線圖](https://medium.com/@ianedws/roadmap-to-bitcoin-developments-f7af59b6d122) - 伊恩·愛德華茲
* 關於為什麼隱私和可替代性可以說是加密貨幣發展的最重要特徵的觀點社論
  * [比特幣融合：最重要的特徵？](https://decentralize.today/bitcoin-fungibility-the-most-important-feature-of-bitcoin-4b87a381f21a) - 雅各布唐納利
* 關於Satoshi硬幣背景下比特幣隱私問題和匿名性改進的一般調查
  * [誰會竊取Satoshi的比特幣？](https://medium.com/@nopara73/stealing-satoshis-bitcoins-cc4d57919a2b) - Adam Ficsor

## 機密交易  Confidential Transactions

機密交易是Adam Back在2014年討論的一種隱私方法，它混淆了交易金額，並且只向發送方，接收方和被選中的任何其他方公開此信息，以便查看此信息並提供參與者更簡單或更任意的證據。

* Blockstream的Adam Back討論了比特幣知識播客中比特幣的機密交易
  * [BTCK 167 - Dr. Back On Confidential Transactions](https://www.youtube.com/watch?v=gwpQ1_Pt7sw) - Adam Back
* 採訪Adam Gibson關於比特幣和其他數字資產的機密交易的重要性
  * [Cypherpunks 101：與Adam Gibson一起加入市場和機密交易](https://www.youtube.com/watch?v=THMajQ87dQE) - Block Digest
* 介紹Bulletproofs令人興奮的原因以及它們如何實現更快的零知識範圍證明以及更實際地實現區塊鏈的機密資產功能
  * [防彈：保密交易的簡短證明及更多](https://www.youtube.com/watch?v=BBe1JzUxSB8) - Cathie Yun
* 深入解釋在Chain協議中引入機密資產的工作
  * [隱藏在平原視線中：在區塊鏈上私下交易](https://blog.chain.com/hidden-in-plain-sight-transacting-privately-on-a-blockchain-835ab75c01cb) - Oleg Andreev
* Greg Maxwell解釋了Coinbase機密交易和鏈上隱私改進背後的技術
  * [Greg Maxwell關於Coinbase的機密交易](https://www.youtube.com/watch?v=LHPYNZ8i1cU) - Coinbase
* 由Lightning開發人員撰寫的機密交易(CT)入門，旨在提供理解該技術的框架
  * [保密交易入門](https://medium.com/@ecurrencyhodler/a-primer-to-confidential-transactions-e6ab3dd2bf1e) - Ecurrency Hodler
* 簡要介紹一下機密交易，這是一種可以分成比特幣和其他區塊鏈的隱私增強功能
  * [保密交易的更大隱私](https://medium.com/chainrift-research/greater-privacy-with-confidential-transactions-6747e029b8b6) - 馬特B.
* 解釋為什麼機密交易可以改善隱私以及有關如何實施此技術的分歧
  * [機密交易/防彈：房間裡的大象](https://medium.com/@nopara73/confidential-transactions-bulletproofs-the-elephant-in-the-room-cfdb37ce509) - Adam Ficsor

## 零知識證明  Zero Knowledge Proofs

零知識證明是一種基本的隱私方法，能夠證明給定信息的所有權，而無需披露信息本身，並且通過以隱私為重點的硬幣和其他區塊鏈的隱私增強改進實現了若干變化。

* 介紹可以進行匿名交易的加密原語和Tor / I2P上的演示服務，該服務實現了一個反垃圾郵件匿名論壇的安全方案
  * [使用現代密碼學的真正匿名證書](https://www.youtube.com/watch?v=22GT3YdaBXM) - Matthew Di Ferrante
* 簡要介紹零知識證明是什麼以及它們對初學者有用的原因
  * [什麼是零知識證明？](https://www.youtube.com/watch?v=s6nYMJq3WA4) - PIVX類
* 計算機科學教授Eli Ben-Sasson討論了區塊鍊和加密貨幣與Zero Knowledge Proofs和zkSNARKs等相關技術的交叉點
  * [Eli Ben-Sasson：零知識證明](https://www.youtube.com/watch?v=1GTRfZ0m7M8) - 震中
* 隱私增強實用程序背後的零知識證明和理論的技術介紹
  * [關於零知識證明的介紹性談話](https://www.youtube.com/watch?v=oubB%E2%80%8B%E2%80%8B-VoFnQk) - Ornet Nevo
* 大多數以隱私為重點的加密貨幣中的基本技術的說明性解釋
  * [零知識證明(zk-SNARKS，ZenCash，ZCash)](https://www.youtube.com/watch?v=hxbgsamAtW8) - TechnoSaviour
* 初學者指導了解零知識證明是什麼以及它們對於加密貨幣的重要性
  * [零知識證明簡介：下一代區塊鏈協議](https://medium.com/coinmonks/introduction-to-zero-knowledge-proof-the-protocol-of-next-generation-blockchain-305b2fc7f8e5) - Coinmonks
* 零知識證明及其開發和隱私實用背後的學術歷史摘要
  * [什麼是零知識證明及其含義是什麼？](https://medium.com/@odincommunity/what-are-zero-knowledge-proofs-and-what-is-the-implication-21e628710023) - 盧卡斯霍威爾
* 簡要概述零知識證明倡導者所做出的承諾以及該技術的潛在效用
  * [令人驚訝的加密技巧承諾採用區塊鍊主流](https://www.technologyreview.com/s/609448/a-mind-bending-cryptographic-trick-promises-to-take-blockchains-mainstream/) - 邁克奧克特
* 防彈如何工作以及為什麼他們可以升級採用更好的區塊鏈隱私技術
  * [防彈如何使比特幣隱私降低成本](https://bitcoinmagazine.com/articles/how-bulletproofs-could-make-bitcoin-privacy-less-costly/) - Michiel Mulders
* 一篇關於公共信託對零知識系統透明度要求的學術論文，特別是敏感數據
  * [可擴展，透明和後量子安全計算完整性](https://eprint.iacr.org/2018/046.pdf) - Eli Ben-Sasson等。
* 一系列帖子中的第一篇在高層次上解釋了零知識系統的技術設計
  * [STARKs，第一部分：多項式證明](https://vitalik.ca/general/2017/11/09/starks_part_1.html) - Vitalik Buterin
* zkSNARKs的簡要概述以及為什麼這種零知識證明是Zcash隱私設計的關鍵
  * [什麼是zk-SNARK？](https://z.cash/technology/zksnarks/) - Zcash團隊
* 關於開發Zerocash作為零知識證明的加密貨幣實現的學術論文
  * [Zerocash：比特幣的分散式匿名支付(擴展版本)](http://zerocash-project.org/media/pdf/zerocash-extended-20140518.pdf) - Eli Ben-Sasson等。
* 一系列文章解釋了zk-SNARKs背後的技術如何運作
  * [Zk-SNARKs：引擎蓋下](https://medium.com/@VitalikButerin/zk-snarks-under-the-hood-b33151a013f6) - Vitalik Buterin

## 環簽名  Ring Signatures

環簽名是一種由Monero等隱私硬幣使用的數字簽名，允許網絡參與者的特定組(或環)中的任何成員通過特定組中的其他人驗證交易，而不會洩露誰批准了簽名。

* 使加密貨幣私密和匿名的技術介紹，包括環形簽名，CoinJoin和zk-SNARKs
  * [隱私硬幣解釋(Ring Signatures，CoinJoin，ZK-SNARKS)](https://www.youtube.com/watch?v=fRnHhjRt_Fk) - Block Wolf
* 將密碼研究介紹到有效的環簽名設計和實現中
  * [標準模型中的高效環簽名](https://www.youtube.com/watch?v=n4VhmYT4hOg) - Giulio Malavolta＆amp;多米尼克施羅德
* 關於Schnorr Ring Signatures改善鏈條隱私的潛力的介紹性介紹
  * [Schnorr Ring簽名](https://www.youtube.com/watch?v=Rnl1g6IccpY) - Bastien Teinturier
* 一個非常簡單的Monero動畫介紹和環簽名隱私
  * [Monero：Ring Confidential Transactions](https://www.youtube.com/watch?v=M3AHp9KgTkQ) - Monero

## MimbleWimble

MimbleWimble是一個隱私和基層可擴展性的區塊鏈協議，最初於2016年推出，後來由數學家Adam Poelstra重新訪問和修訂。像Grin和Beam這樣的MimbleWimble實現維護了由Greg Maxwell開發的機密交易技術借用的鏈上交易的有效性。

* 關於MimbleWimble如何工作的簡單入門，而不深入數學和密碼學
  * [MimbleWimble如何工作？](https://medium.com/beam-mw/how-MimbleWimble-works-18ea3980cffe) - Beam Privacy Team
* 什麼是MimbleWimble，它的好處就像你五歲一樣
  * [ELI5：MimbleWimble](https://medium.com/@bangladepp/eli5-MimbleWimble-5bdcc5b21a00) - 詹姆斯韋伯
* 通過MimbleWimble總結哈利波特與加密貨幣之間的聯繫
  * [MimbleWimble簡史：從霍格沃茨到移動錢包](https://medium.com/beam-mw/a-short-history-of-MimbleWimble-from-hogwarts-to-mobile-wallets-2514a21debb) - 貝尼Issembert
* 非常簡單地介紹MimbleWimble作為比特幣替代隱私的協議
  * [MimbleWimble解釋得像你一樣](https://medium.com/beam-mw/MimbleWimble-explained-like-youre-12-d779a5bb483d) - Conor O'Higgins
* 關於MimbleWimble的簡單入門和第一個實現：Grin和Beam
  * [我們需要了解的關於Grin和BEAM的信息](https://medium.com/@QB_community/what-we-need-to-know-about-grin-and-beam-d512a2b7e8b) - QB Exchange
* 簡要介紹MimbleWimble作為Grin和Beam使用的隱私技術的優缺點
  * [關於MimbleWimble的可鏈接性](https://medium.com/beam-mw/on-linkability-of-MimbleWimble-da9ba71e83b4) - Alex Romanov
* 關於MimbleWimble是否可以提供同類最佳隱私以及MW和其他隱私技術(如zk-SNARKs)之間的比較的高級別討論
  * [MimbleWimble：好與壞](https://www.tokendaily.co/blog/MimbleWimble-the-good-and-the-bad) - Mohamed Fouda
* 來自Beam的一篇關於隱私本體的論文，旨在幫助開發人員從純粹基於隱私的角度構建金融世界
  * [隱私本體論簡介](https://medium.com/beam-mw/introduction-to-a-privacy-ontology-part-1-c59088a4186c) - Beni Issembert

## 蒲公英  Dandelion

蒲公英是由Giulia Fanti引入的輕量級協議，在區塊鏈的基礎層實施，為節點引入新模式，以便相互通信網絡活動，同時阻礙了回溯事務傳播和破壞網絡隱私和安全的努力參與者。

* 解釋蒲公英是什麼以及為什麼它對比特幣的擴展和隱私發展很重要
  * [蒲公英和比特幣隱私的光明未來](https://medium.com/@thecryptoconomy/dandelions-and-a-bright-future-for-bitcoin-privacy-712dbc4b1ec5) - Cryptoconomy
* Zack Voell與計算機科學家Giulia Fanti進行了會談，他在2017年的時候介紹了蒲公英協議，關於改善比特幣交易的匿名性以及匿名點對點支付的重要性
  * [介紹蒲公英(BIP 156)和Giulia Fanti](https://open.spotify.com/episode/7DN9pnhLHeJOnwrhfnbY5U?si=N4ei2r7dRny5ZY0lWMMg7g) - Zack Voell
* Andreas Antonopoulos在有關隱私協議(如蒲公英和MimbleWimble)的記錄Q＆amp; A會話中對觀眾提問
  * [比特幣Q＆amp; A：MimbleWimble和蒲公英](https://www.youtube.com/watch?v=LjDJGTpK_lE) - Andreas Antonopoulos
* Giulia Fanti介紹了蒲公英有可能大大提高比特幣在線交易的交易隱私
  * [蒲公英 - 以比特幣為基礎](https://www.youtube.com/watch?v=SrE6KdBgI1o) - Giulia Fanti

## 防彈  Bulletproofs

防彈是一種零知識證明，旨在實現高效的機密交易。與零知識“SNARKS”不同，Bulletproofs不需要參與者之間的可信設置，但驗證更加耗時。

* 簡要介紹防彈作為增強數字資產交易隱私的工具的潛力
  * [防彈：保密交易的簡短證明及更多](https://www.youtube.com/watch?v=Adrh6BCc_Ao) - Benedikt Bunz
* 防彈技術介紹
  * [BenediktBünz：Bulletproofs](https://www.youtube.com/watch?v=gMI8dkwGGcw) - SF比特幣開發者
* 分析將加密事務保密和防彈作為現實解決方案的一些關鍵問題
  * [防彈：保密交易的簡短證明及更多](https://www.youtube.com/watch?v=sgruTaH_w1s) - Benedikt Bunz
* 安德烈亞斯·安東諾普洛斯(Andreas Antonopoulos)向觀眾提出了關於防彈措施以及匿名加密貨幣重要性的問題
  * [比特幣Q＆amp; A：什麼是防彈？](https://www.youtube.com/watch?v=EDaM8A-tAck) - Andreas Antonopoulos
* Interstellar使用約束系統API擴展Bulletproofs的進展的技術說明，以實現任意語句的零知識證明
  * [用於防彈的可編程約束系統](https://medium.com/interstellar/programmable-constraint-systems-for-bulletproofs-365b9feb92f7) - Cathrie Yun
* 全面了解Monero當前的技術堆棧以及Bulletproofs的重要性
  * [Monero變成防彈](https://medium.com/digitalassetresearch/monero-becomes-bulletproof-f98c6408babf) - Lucas Nuzzi

## 其他文章  Other articles

* [比特幣混合服務的政治](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/blob/master/article/%E6%AF%94%E7%89%B9%E5%B9%A3%E6%B7%B7%E5%90%88%E6%9C%8D%E5%8B%99%E7%9A%84%E6%94%BF%E6%B2%BB.md)
* [CoinJoin：現實世界的比特幣隱私](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/blob/master/article/CoinJoin%EF%BC%9A%E7%8F%BE%E5%AF%A6%E4%B8%96%E7%95%8C%E7%9A%84%E6%AF%94%E7%89%B9%E5%B9%A3%E9%9A%B1%E7%A7%81.md)
* [真的是最終的區塊鏈壓縮：CoinWitness](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/blob/master/article/%E7%9C%9F%E7%9A%84%E6%98%AF%E6%9C%80%E7%B5%82%E7%9A%84%E5%8D%80%E5%A1%8A%E9%8F%88%E5%A3%93%E7%B8%AE%EF%BC%9ACoinWitness.md)
* [通過DARKSEND+分析DARKCOIN的區塊鏈隱私](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/blob/master/article/%E9%80%9A%E9%81%8EDARKSEND+%E5%88%86%E6%9E%90DARKCOIN%E7%9A%84%E5%8D%80%E5%A1%8A%E9%8F%88%E9%9A%B1%E7%A7%81.md)
* [CoinShuffle：用於比特幣的實用分散硬幣混合](https://github.com/cypherpunks-core/blockchain_privacy_resources_zh/blob/master/article/CoinShuffle%EF%BC%9A%E7%94%A8%E6%96%BC%E6%AF%94%E7%89%B9%E5%B9%A3%E7%9A%84%E5%AF%A6%E7%94%A8%E5%88%86%E6%95%A3%E7%A1%AC%E5%B9%A3%E6%B7%B7%E5%90%88.md)