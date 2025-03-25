---
layout: post
title: "Minisketch：降低節點頻寬要求"
date: 2019-09-24
image: /img/minisckecth.jpg
description: "Minisketch：將能夠減少在分佈式系統中同步數據時所需的頻寬。"
published: true
hero_image: /img/hero.png
categories: news
---

Pieter Wuille January 07, 2019 [轉載 blockstream](https://blockstream.com/2019/01/07/en-minisketch-reducing-node-bandwidth-requirements/)

![](/img/minisckecth.jpg)

最近Blockstream團隊成員Pieter Wuille和Gleb Naumenko以及前同事Greg Maxwell共同揭曉了[Minisketch](https://github.com/sipa/minisketch)，這個軟體庫將能夠減少在分佈式系統中同步數據時所需的頻寬。

Minisketch原本是一個項目中的組成部分，這個項目旨在研究如何利用配置對賬（set reconciliation）來在比特幣節點之間傳遞交易信息，即“配置對賬中繼”（Set Reconciliation Relay，簡稱SRR ）。SRR的目標就是要大幅度降低運行比特幣全節點的頻寬要求。

開發團隊決定將Minisketch從SRR項目中拿出來單獨發布，是因為這項技術在比特幣以及其他行業都有十分廣闊的應用前景。

# 為什麼選擇Minisketch？

所有分佈式系統一直都面臨著在不同節點之間同步數據的困難，如果是一個中心化的系統的話，只需要中心下令哪些數據應該保存、哪些數據應該刪除即可。

例如，在去中心化網絡上進行數據同步的一個方法是Invertible Bloom Lookup Tables （IBLT）。IBLT對CPU的要求比較低，但這是以較高的頻寬要求為代價換取的，特別是當差異數量很小時。Minisketch使用的則是更加節省頻寬要求的算法PinSketch。

和其他寬帶利用效率較高的配置對賬算法，如CPISync和Pinsketch最初的配置相比，Minisketch將佔用更少計算資源，比PinSketch快20到100倍，有時候比CPISync快上1000倍。

# 工作原理

由Minisketch實現的配置對賬可以更加高效地利用頻寬，不是簡單地將所有的數據列都發送過去，而是讓節點自己產生數據列的“素描（sketch）”。節點接著把這個“素描”發給其他節點進行對比。這個“素描”的大小只與節點之間差異數量期望有關，而與整個數據組的大小無關。儘管如此，節點仍然能夠確定他們從其他節點需要哪些數據。

“假設只有一個差別，這樣就很好理解了：我有一個數列{3,5,7,11}，你有一個數列{3,5,7,9,11}，我和你的差別就是{ 9}。我們都對這個數列裡的數字進行求和，那麼我會得到3+5+7+11=26，而你會得到3+5+7+9+11=35。我把我的求和結果26發給你，你用你的求和結果35相減之差為9。這個原理只有在差別數量為1時才能求出差別。Minisketch推廣了這個原理，發送數據的不同種類的“求和”，有N個不同的求和結果，也就能夠找到N中差別… 只要不同數據組差別的數量不大於發送的求和結果數量，Minisketch就一定能成功地找到所有的差別。” –Pieter Wuille, Blockstream聯合創始人

# Minisketch在比特幣中的應用

比特幣網絡的穩定性取決於全節點間是否有足夠的連接來阻止[Sybil](https://en.bitcoin.it/wiki/Weaknesses#Sybil_attack)和[分區](https://en.bitcoin.it/wiki/Weaknesses#Segmentation)攻擊。

不幸的是，一個比特幣節點大部分數據用量（一般在40%至70%）甚至根本不是用來儲存交易數據，而是用來宣布新交易的產生以及找到下一個中繼節點。目前的情況下，提高節點間的連接數量也會在一定程度上提高對頻寬的要求，這就限制了每個節點所能支持的連接數量。

配置對賬讓我們能夠高效地找出哪些交易尚未被中繼，而不需要每筆交易都要向其他所有節點宣布。尋找尚未被中繼的交易所佔用的頻寬就不再受連接數量的影響，可能會提高每個節點所能支持的連接數量。

這個解決方案的美妙之處就在於完全不需要對比特幣網絡共識規則做任何改動。當雙方的密碼學軟體都支持SRR協議的時候，SRR就會啟動，而且不會對不想參與的節點運營者產生任何影響。

SRR協議目前仍在研究初期階段，要真正應用到比特幣網絡上還有很長的路要走，但像Minisketch這樣的成果代表了比特幣全節點普及應用（以及其他分佈式網絡的優化）中的一個非常重要的里程碑。該項目的更多進展，敬請拭目以待！

*要了解更多關於Minisketch的詳情，請查看[Minisketch Github repository](https://github.com/sipa/minisketch)。*