---
title: 比特幣資源
subtitle: Bitcoin resources
layout: page
# callouts: home_callouts
# hide_hero: true
hero_image: /img/hero.png
show_sidebar: true
hero_height: 0
---

比特幣是一個革命性的系統，非常複雜，學習曲線陡峭。密碼龐克分類整理出多個具指標性的實用網站，期待能幫助對比特幣有興趣的朋友初步了解比特幣。

> 最後更新：2025年

---

## 目錄

- [2020-2024 重大更新](#2020-2024-重大更新)
- [新聞](#新聞news)
- [入門](#入門)
- [區塊鏈檢視器](#區塊鏈檢視器blockchain-explorer)
- [全節點軟體與服務](#全節點軟體與服務)
- [深度的技術資源](#深度的技術資源deep-dive-technical-resources)
- [開發者資源](#開發者資源-2024)
- [台灣加密貨幣交易所](#台灣加密貨幣交易所)

---

## 2020-2024 重大更新

### Taproot 升級（2021年11月啟用）

Taproot 是比特幣自 SegWit 以來最重大的升級，包含三個 BIP：

* **[BIP 340: Schnorr Signatures](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)** - 引入 Schnorr 簽名，提升效率和隱私
* **[BIP 341: Taproot](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki)** - 結合 MAST，讓複雜腳本看起來像普通交易
* **[BIP 342: Tapscript](https://github.com/bitcoin/bips/blob/master/bip-0342.mediawiki)** - 更新腳本驗證規則

**延伸閱讀：**
* [Bitcoin Optech: Taproot](https://bitcoinops.org/en/topics/taproot/)
* [Taproot 是什麼？- River Financial](https://river.com/learn/what-is-taproot/)

### Ordinals 與 Inscriptions（2023）

* **[Ordinals Protocol](https://docs.ordinals.com/)** - 為每個聰（satoshi）賦予序號的協議
* **[Inscriptions](https://docs.ordinals.com/inscriptions.html)** - 將數據永久刻錄到比特幣區塊鏈
* **[BRC-20](https://domo-2.gitbook.io/brc-20-experiment/)** - 基於 Ordinals 的代幣標準實驗

### 隱私技術進展

* **[BIP 352: Silent Payments](https://github.com/bitcoin/bips/blob/master/bip-0352.mediawiki)** - 無需交互即可接收隱私支付
* **[Payjoin (BIP 78)](https://github.com/bitcoin/bips/blob/master/bip-0078.mediawiki)** - 打破交易分析的支付方式

### Layer 2 與擴展方案

* **[BitVM](https://bitvm.org/)** - 將圖靈完備計算帶入比特幣
* **[RGB Protocol](https://rgb.tech/)** - 比特幣上的智能合約和資產發行
* **[Ark](https://ark-protocol.org/)** - 新型 Layer 2 協議

### 2024 年第四次減半

2024年4月，比特幣區塊獎勵從 6.25 BTC 減至 3.125 BTC。

* [Bitcoin Halving 2024 - River Financial](https://river.com/learn/bitcoin-halving/)

---

## 新聞(News)

* **[Bitcoin Magazine](https://bitcoinmagazine.com/)** - Bitcoin Magazine 是全球第一家專注於數字貨幣和區塊鏈技術的媒體。2012年 Mihai Alisie 和以太坊創始人 Vitalik Buterin 聯合推出了第一本 Bitcoin Magazine。
* **[Bitcoin Optech Newsletter](https://bitcoinops.org/en/newsletters/)** - 這是一個由 Bitcoin Core 核心開發者（James O'Beirne, David A. Harding）所組織的團隊，說明 Bitcoin Core 最新的技術與進度。
* **[The Block](https://www.theblockcrypto.com/)** - 以簡報條列式的方式，呈現比特幣技術、密碼貨幣技術、公司、規範、研究報告。
* **[CoinDesk](https://www.coindesk.com/)** - 一家相當具有影響力的媒體公司，報導的內容包括各種密碼貨幣所採用的技術、全世界的政府與密碼貨幣的關係、密碼貨幣在各大企業中的使用場景。

## 入門

* [介紹影片] **[What is Bitcoin? (v2)](https://youtu.be/Gc2en3nHxA4)** - 這是一個放在 bitcoin.org 網站上簡單的 Bitcoin 介紹影片。
* **[維基百科 – 比特幣](https://zh.wikipedia.org/wiki/%E6%AF%94%E7%89%B9%E5%B8%81)** - 中文說明是學習比特幣最快的方法，這邊有比特幣的現況，介紹一些使用到的技術，過去發生過的歷史。
* **[Taipei Ethereum Meetup 的 Bitcoin 板](https://medium.com/taipei-ethereum-meetup/bitcoin/home)** - 這邊有許多剛接觸 Ethereum 的朋友，順便撰寫了一些 Bitcoin 的讀書心得，值得大家參考。
* [論文] **[The Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)** - 這是由 Satoshi Nakamoto 所撰寫的比特幣原始的論文。
* **[The Bitcoin Wiki](https://en.bitcoin.it/wiki/Main_Page)** - 由 Bitcoin Core 的成員參與貢獻的比特幣維基百科。
* [書] **[Mastering Bitcoin](https://github.com/bitcoinbook/bitcoinbook/blob/develop/book.asciidoc)** - 面向開發人員，前兩章對比特幣的介紹也適用於非開發人員。任何對技術有基本瞭解的人都可以閱讀前兩章，以深入瞭解比特幣。
  * [繁體中文 – Mastering Bitcoin 2nd Edition – 繁中](https://github.com/ChenPoWei/bitcoinbook_2nd_zh)
  * [簡體中文 – 精通比特币（第二版）](http://book.8btc.com/masterbitcoin2cn)
* **[Bitcoin for Beginners](https://www.youtube.com/playlist?list=PLPQwGV1aLnTuN6kdNWlElfr2tzigB9Nnj)** - Mastering Bitcoin 作者經營的 YouTube 頻道。
* **[satoshinakamoto.me](http://satoshinakamoto.me/)** - 這邊儲存了所有 Satoshi Nakamoto 最原始的郵件紀錄。

## 區塊鏈檢視器(Blockchain Explorer)

比特幣區塊鏈當中的原始數據對人類而言是難以閱讀，所以有許多開發者嘗試以不同的呈現方式把數據展示給我們看，使我們有更快速的方式去理解。

* **[mempool.space](https://mempool.space/)** - 目前最受歡迎的開源區塊瀏覽器，提供即時交易池視覺化、手續費預估、閃電網路瀏覽器等功能，可自行架設。
* **[Learn me a Bitcoin](http://learnmeabitcoin.com/)** - 此區塊鏈檢視器與常見的檢視器不同，將區塊鏈的概念圖形化，使民眾更好理解。
* **[Blockstream.info](https://blockstream.info/)** - 由 Blockstream 公司開發的區塊鏈檢視器，支援 Liquid Network。
* **[BlockCypher](https://live.blockcypher.com/btc/)** - 開源的區塊鏈檢視器，相當穩定，自 2014 年底發佈。
* **[blockchain.com](https://www.blockchain.com/explorer)** - 老字號區塊鏈檢視器公司，成立於 2011 年，提供錢包和 API 服務。
* **[OXT](https://oxt.me/)** - 專注於鏈上分析的區塊瀏覽器，提供詳細的交易圖表和錢包分析功能。
* **[Yogh.io](http://yogh.io/#block:last)** - 將最原始的區塊鏈數據（十六進制）視覺化呈現。

## 全節點軟體與服務

運行自己的全節點是參與比特幣網路的最佳方式，可以驗證所有交易，不依賴第三方。

### 節點軟體

* **[Bitcoin Core](https://bitcoincore.org/)** - 比特幣官方參考實現，由 Bitcoin Core 開發者社群維護
* **[Bitcoin Knots](https://bitcoinknots.org/)** - 基於 Bitcoin Core 的替代版本，包含額外功能和政策選項
* **[btcd](https://github.com/btcsuite/btcd)** - 使用 Go 語言實現的比特幣全節點
* **[libbitcoin](https://libbitcoin.info/)** - 跨平台 C++ 比特幣開發庫和節點實現

### 一體化節點解決方案

這些專案讓運行全節點變得簡單，通常包含閃電網路節點、區塊瀏覽器等服務：

* **[Umbrel](https://umbrel.com/)** - 美觀易用的節點操作系統，支援應用商店擴展功能
* **[Start9](https://start9.com/)** - 強調隱私和主權的節點解決方案
* **[RaspiBlitz](https://raspiblitz.org/)** - 基於樹莓派的 DIY 閃電網路節點，功能豐富
* **[MyNode](https://mynodebtc.com/)** - 提供免費版和付費版的節點軟體，支援多種硬體
* **[Citadel](https://runcitadel.space/)** - Umbrel 的開源替代方案
* **[Nodl](https://www.nodl.eu/)** - 預裝硬體節點解決方案

### 節點連線工具

* **[Tor Project](https://www.torproject.org/)** - 匿名網路，保護節點隱私
* **[I2P](https://geti2p.net/)** - 另一種匿名網路協議，Bitcoin Core 已支援

---

## 開發者資源 2024

### 開發工具與函式庫

* **[Bitcoin Dev Kit (BDK)](https://bitcoindevkit.org/)** - 模組化的比特幣錢包開發庫，支援 Rust、Swift、Kotlin
* **[Lightning Dev Kit (LDK)](https://lightningdevkit.org/)** - 用於構建閃電網路應用的 Rust 函式庫
* **[rust-bitcoin](https://github.com/rust-bitcoin/rust-bitcoin)** - Rust 語言的比特幣函式庫生態系統
* **[bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)** - JavaScript 比特幣開發庫
* **[python-bitcoinlib](https://github.com/petertodd/python-bitcoinlib)** - Python 比特幣開發庫
* **[libsecp256k1](https://github.com/bitcoin-core/secp256k1)** - 優化的橢圓曲線密碼學函式庫

### 測試與開發環境

* **[Polar](https://lightningpolar.com/)** - 一鍵式閃電網路本地測試環境，支援 LND、CLN、Eclair
* **[Bitcoin Signet](https://en.bitcoin.it/wiki/Signet)** - 受控的測試網路，適合開發測試
* **[Testnet4](https://github.com/bitcoin/bips/blob/master/bip-0094.mediawiki)** - 最新測試網路（BIP 94）
* **[Regtest](https://developer.bitcoin.org/examples/testing.html)** - 本地回歸測試模式

### 學習資源

* **[Learn me a Bitcoin](https://learnmeabitcoin.com/)** - 互動式比特幣技術教學網站
* **[Bitcoin Optech Topics](https://bitcoinops.org/en/topics/)** - 比特幣技術主題索引與解說
* **[Chaincode Labs Seminars](https://chaincode.gitbook.io/seminars/)** - 深度比特幣開發者培訓課程
* **[Saylor Academy - Bitcoin for Developers](https://learn.saylor.org/course/view.php?id=500)** - 免費比特幣開發課程

### API 服務

* **[mempool.space API](https://mempool.space/docs/api)** - 開源區塊鏈 API，支援自架
* **[Blockstream Esplora API](https://github.com/Blockstream/esplora)** - 開源區塊瀏覽器 API
* **[Electrum Server](https://github.com/spesmilo/electrs)** - 輕量級錢包後端服務

---

## 深度的技術資源（Deep Dive Technical Resources）

如果希望可以進一步了解比特幣區塊鏈的技術原理，這些資源適合你慢慢摸索。

* [書] **[Bitcoin & Cryptocurrency Technologies](https://lopp.net/pdf/princeton_bitcoin_book.pdf)** (Princeton textbook) - 於 2014 年普林斯頓大學開設一門區塊鏈為主題的公開課程，並為該課程撰寫了教科書，該書的內容從學理出發，討論到的程式碼相當少。
  * [繁體中文版 – 區塊鏈：金融科技與創新](https://www.books.com.tw/products/0010752934)
  * [簡體中文版 – 区块链技术驱动金融](https://www.amazon.cn/dp/B01KGYHBEM)
* **[Bitcoin Developer Guide](https://bitcoin.org/en/developer-guide)** - 這是一份由 bitcoin.org 團隊所撰寫維護的區塊鏈技術文件。該文件是以 Satoshi 撰寫的論文為基礎，再加以不斷的延伸擴充。
* **[Bitcoin Improvement Proposals](https://github.com/bitcoin/bips/blob/master/README.mediawiki)** - 中文譯為「比特幣改進提案」，英文簡稱 BIP。該文件中記載了所有 BIP 的概述與細節。
* [教學影片] **[Bitcoin Edge Workshop](https://www.youtube.com/channel/UCywSzGiWWcUG1gTp45YdPUQ/videos)** (20+ hours of tutorials) - 這是一個由 Bitcoin Core 團隊參與的 Bitcoin 技術的推廣活動，以最基礎的數學理論仔細的闘述比特幣所有相關的技術以及運作原理。
* [文獻庫] **[Bitcoin Ninja](http://bitcoin.ninja/)** - 搜集一些具特色的比特幣技術相關的論文。
* [論文] **[Bitcoin Protocol Reference](https://lopp.net/pdf/Bitcoin_Developer_Reference.pdf)** - 比特幣的出現，僅依靠著中本聰撰寫的比特幣白皮書以及比特幣的原始碼，該論文將補足協議細節說明。
* [閱讀庫] **[Blockchain Reading List](https://github.com/reiver/blockchain-reading-list)** - 在 Github 中整理的推薦閱讀清單。文檔面向技術人員，希望深入了解基於區塊鏈技術背後的概念。
* [文獻庫] **[Comprehensive Academic Bitcoin Research Archive](https://cdecker.github.io/btcresearch/)** - 致力於搜集所有品質且與區塊鏈相關的論文庫
* [書] **[Programming with Bitcoin Core and Lightning](https://github.com/ChristopherA/Learning-Bitcoin-from-the-Command-Line)** - 這是一個使用比特幣（和 Lightning）的教程，它教授與伺服器本身直接交互，作為開始密碼貨幣工作是最強大和最安全的方式。
* [閱讀庫] **[Blockchain-stuff](https://github.com/Xel/Blockchain-stuff)** - 區塊鏈和一般加密貨幣資源的精選列表。
* **[Intro to Bitcoin for Developers](http://davidederosa.com/basic-blockchain-programming/)** - 一個以 C 語言為基礎，教你慢慢地刻出比特幣的教學。
* **[Programming the Blockchain in C#](https://programmingblockchain.gitbooks.io/programmingblockchain/content/)** - 以 C# 為基礎，解釋比特幣的運作與實現。
* **[Using the Raw Bitcoin Protocol](http://www.righto.com/2014/02/bitcoins-hard-way-using-raw-bitcoin.html)** - 首先簡要介紹比特幣，然後跳轉到底層細節：創建比特幣地址，進行交易，簽署交易，將交易提供給 p2p 網絡。
* **[A Peek Under Bitcoin's Hood](http://www.samlewis.me/2017/06/a-peek-under-bitcoins-hood/)** - 這篇文章介紹了創建一個最低限度可行的比特幣客戶端的過程。
* [書] **[Programming Bitcoin](https://github.com/jimmysong/programmingbitcoin/blob/master/ch01.asciidoc)** - 這是一本由 Bitcoin Core 開發者 Jimmy Song 所撰寫的比特幣的運作原理，從數論開始教。

---

## 台灣加密貨幣交易所

> 注意：在使用任何交易所前，請自行進行盡職調查（DYOR）。建議將大部分資產存放在自己控制的錢包中。

### 台灣本地交易所

* **[MAX](https://max.maicoin.com/)** - MaiCoin 團隊打造的數位資產交易所，支援新台幣出入金
* **[BitoPro](https://www.bitopro.com/)** - 幣託（BitoEX）旗下交易所，支援新台幣出入金
* **[ACE](https://ace.io/)** - 王牌數位交易所，支援新台幣出入金
* **[XREX](https://xrex.io/)** - 台灣新興交易所，專注於跨境支付

### 國際交易所（支援台灣用戶）

* **[Binance](https://www.binance.com/)** - 全球最大加密貨幣交易所
* **[OKX](https://www.okx.com/)** - 提供多樣化衍生品交易
* **[Kraken](https://www.kraken.com/)** - 老牌交易所，安全性佳
* **[Bitfinex](https://www.bitfinex.com/)** - 專業交易平台，支援進階交易功能

### 去中心化交易所（DEX）

* **[Bisq](https://bisq.network/)** - 點對點比特幣交易，無需 KYC
* **[RoboSats](https://learn.robosats.com/)** - 基於閃電網路的 P2P 交易平台
* **[Hodl Hodl](https://hodlhodl.com/)** - 非託管式 P2P 比特幣交易
