---
layout: post
title: 'BOLT 12 Offers：閃電網路支付的未來'
date: 2025-02-10
categories:
- lightning
- bolt
description: 深入解析 BOLT 12 Offers 協議，這是閃電網路支付體驗的重大改進，實現可重複使用的支付請求和更好的隱私。
image: /img/bolt12.svg
published: true
hero_image: /img/hero.png
tags:
- lightning
- bolt12
- offers
- payment
---

## 前言

閃電網路的支付體驗一直有一個痛點：每次收款都需要生成新的 invoice。**BOLT 12 Offers** 是一個革命性的改進，引入了可重複使用的支付請求、更好的隱私保護，以及更豐富的支付功能。

---

## 一、當前 Invoice 的問題

### BOLT 11 Invoice 的限制

```
# 典型的 BOLT 11 invoice
lnbc10u1p3...（非常長的字串）
```

**主要問題：**

| 問題 | 說明 |
|------|------|
| **一次性使用** | 每次收款需要新的 invoice |
| **需要在線** | 接收者必須在線生成 invoice |
| **過期時間** | Invoice 會過期 |
| **金額固定** | 金額在生成時就固定 |
| **隱私洩漏** | 暴露節點公鑰 |

### 用戶體驗困境

```
傳統流程：
1. 買家：「我要付款」
2. 賣家：（生成 invoice）「這是 invoice」
3. 買家：（掃描/複製）付款
4. 等待確認

每次交易都需要這個來回過程
```

---

## 二、BOLT 12 Offers 概述

### 什麼是 Offer？

Offer 是一個靜態的、可重複使用的支付請求標識符：

```
# Offer 格式
lno1qgsq...（較短的字串）
```

**核心特性：**
- ✅ 可重複使用
- ✅ 接收者可離線
- ✅ 支援變動金額
- ✅ 更好的隱私
- ✅ 雙向支付流

### 與 BOLT 11 比較

| 特性 | BOLT 11 | BOLT 12 |
|------|---------|---------|
| 重複使用 | ❌ | ✅ |
| 離線生成 | ❌ | ✅ |
| 固定金額 | 是 | 可選 |
| 退款支援 | ❌ | ✅ |
| 隱私 | 差 | 好 |
| 訂閱支援 | ❌ | ✅ |

---

## 三、技術架構

### Offer 結構

```
offer:
  - description: "Coffee Shop"
  - node_id: <blinded_path>
  - amount: <optional>
  - currency: <optional, e.g., USD>
  - quantity_min/max: <optional>
  - recurrence: <optional>
```

### 支付流程

```
                 Offer（靜態）
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
 付款者1          付款者2          付款者3
    │                │                │
    ▼                ▼                ▼
Invoice Request  Invoice Request  Invoice Request
    │                │                │
    ▼                ▼                ▼
  Invoice          Invoice          Invoice
    │                │                │
    ▼                ▼                ▼
  Payment          Payment          Payment
```

### 洋蔥消息（Onion Messages）

BOLT 12 依賴新的洋蔥消息系統：

```
# 請求 invoice
Payer → Onion Message → Payee
        (invoice_request)

# 返回 invoice
Payee → Onion Message → Payer
        (invoice)
```

**優勢：**
- 不需要支付通道
- 端到端加密
- 路徑隱藏

---

## 四、盲化路徑（Blinded Paths）

### 隱私問題

傳統閃電網路：
```
付款者 → 節點A → 節點B → 接收者
                        ↑
                  公鑰暴露
```

### 盲化解決方案

```
接收者創建盲化路徑：
  真實路徑：X → Y → 接收者
  盲化路徑：?? → ?? → ??

付款者只看到：
  付款者 → ... → 盲化入口 → ??
```

### 技術實現

```
blinded_path:
  - introduction_node: <公開的入口節點>
  - blinding_point: <用於解密的點>
  - encrypted_path: [
      {node_id: <加密>, encrypted_data: <加密>},
      {node_id: <加密>, encrypted_data: <加密>}
    ]
```

**結果：**
- 付款者不知道接收者是誰
- 路徑中的節點只知道下一跳
- 更強的隱私保護

---

## 五、實際應用場景

### 1. 商家收款

**傳統方式：**
```
顧客：「我要買咖啡」
店員：（生成 invoice）「請掃這個 QR code」
顧客：（等待 invoice 生成...）掃描付款
```

**BOLT 12 方式：**
```
# 店家的靜態 Offer（印在菜單上）
lno1qgsq...

顧客：（掃描）選擇金額 → 自動獲取 invoice → 付款
整個過程無需店員參與
```

### 2. 捐款頁面

```html
<!-- 網頁上的靜態捐款地址 -->
<a href="lightning:lno1qgsq...">
  支持我們的工作
</a>

<!-- 用戶可以：-->
<!-- - 選擇任意金額 -->
<!-- - 添加留言 -->
<!-- - 設置週期性捐款 -->
```

### 3. 訂閱服務

```
offer:
  description: "月度會員"
  amount: 10000 sats
  recurrence:
    period: monthly
    start: 1704067200  # 開始時間
```

**流程：**
1. 用戶掃描訂閱 Offer
2. 錢包自動每月請求新 invoice
3. 自動完成付款

### 4. 退款功能

```
# 原始支付包含退款路徑
payment:
  invoice: <...>
  payer_info:
    refund_path: <盲化路徑>

# 商家發起退款
refund:
  original_payment_hash: <...>
  amount: <退款金額>
  path: <使用付款者提供的路徑>
```

---

## 六、實現狀態

### 節點支援

| 實現 | BOLT 12 狀態 | 備註 |
|------|-------------|------|
| **Core Lightning** | ✅ 完整支援 | 最早實現 |
| **LDK** | ✅ 支援中 | 持續開發 |
| **LND** | 🚧 開發中 | 計劃支援 |
| **Eclair** | 🚧 開發中 | 部分功能 |

### 錢包支援

| 錢包 | 狀態 |
|------|------|
| **Phoenix** | ✅ 支援 |
| **Zeus** | 🚧 開發中 |
| **Breez** | 🚧 計劃中 |

### 實驗性使用

```bash
# Core Lightning 創建 Offer
lightning-cli offer amount=any description="Donations"

# 輸出
{
  "offer_id": "...",
  "bolt12": "lno1qgsq..."
}
```

---

## 七、與其他方案比較

### vs LNURL

| 特性 | LNURL | BOLT 12 |
|------|-------|---------|
| 依賴 | HTTP 服務器 | 純閃電網路 |
| 去中心化 | 需要服務器 | 完全去中心化 |
| 隱私 | 暴露 IP | 盲化路徑 |
| 標準化 | 社區標準 | BOLT 規範 |
| 複雜度 | 低 | 中 |

### vs 靜態 Invoice

```
靜態 Invoice（不推薦）：
- 同一個 payment_hash
- 安全風險（重放攻擊）
- 違反協議設計

BOLT 12 Offer：
- 每次支付新的 payment_hash
- 安全合規
- 原生協議支援
```

### vs Keysend

| 特性 | Keysend | BOLT 12 |
|------|---------|---------|
| 接收者確認 | ❌ | ✅ |
| 金額協商 | ❌ | ✅ |
| 元數據 | 有限 | 豐富 |
| 隱私 | 差 | 好 |

---

## 八、安全考量

### 拒絕服務防護

```
# Offer 可以包含速率限制
offer:
  rate_limit:
    requests_per_hour: 100
    max_amount_per_day: 1000000
```

### 垃圾請求過濾

- 洋蔥消息有成本（路由費）
- 節點可以限制未知來源的請求
- 可選的 proof-of-work 要求

### 隱私保護措施

1. **盲化路徑** - 隱藏接收者身份
2. **新 payment_hash** - 每次支付不同
3. **無需公開節點** - 可以完全私密運營

---

## 九、開發者指南

### 創建 Offer（Core Lightning）

```bash
# 基本 Offer
lightning-cli offer amount=1000sat description="Test"

# 任意金額
lightning-cli offer amount=any description="Donations"

# 帶數量的 Offer
lightning-cli offer amount=100sat description="Stickers" \
  quantity_min=1 quantity_max=10
```

### 解析 Offer

```python
from bolt12 import decode_offer

offer = decode_offer("lno1qgsq...")
print(offer.description)  # "Coffee Shop"
print(offer.amount)       # None（任意金額）
print(offer.node_id)      # 盲化的節點 ID
```

### 請求 Invoice

```bash
# 從 Offer 獲取 Invoice
lightning-cli fetchinvoice offer=lno1qgsq... amount_msat=10000
```

### 支付流程實現

```javascript
// 完整的支付流程
async function payOffer(offer, amount) {
  // 1. 發送 invoice_request
  const invoiceRequest = await createInvoiceRequest(offer, amount);

  // 2. 通過洋蔥消息發送
  const invoice = await sendOnionMessage(invoiceRequest);

  // 3. 驗證 invoice
  if (!validateInvoice(invoice, offer)) {
    throw new Error("Invalid invoice");
  }

  // 4. 執行支付
  return await payInvoice(invoice);
}
```

---

## 十、未來展望

### 生態系統發展

1. **錢包普及** - 更多錢包將支援 BOLT 12
2. **商家採用** - POS 系統整合
3. **自動化支付** - 訂閱和週期性支付

### 技術演進

- **與 Taproot 整合** - 更好的隱私
- **PTLCs** - 替代 HTLCs
- **異步支付** - 離線接收改進

### 潛在應用

```
- 流媒體支付（按秒計費）
- 機器對機器支付
- 智能合約觸發支付
- 跨平台訂閱
```

---

## 結論

BOLT 12 Offers 是閃電網路支付體驗的重大飛躍：

1. **用戶體驗** - 靜態地址，無需每次生成 invoice
2. **隱私保護** - 盲化路徑隱藏接收者身份
3. **功能豐富** - 退款、訂閱、可變金額
4. **去中心化** - 不依賴外部服務器

隨著主要實現的支援完善，BOLT 12 將成為閃電網路支付的新標準。對於開發者和商家來說，現在是開始了解和實驗這項技術的好時機。

---

## 參考資料

- [BOLT 12 規範](https://github.com/lightning/bolts/pull/798)
- [Offers 介紹 - Rusty Russell](https://bolt12.org/)
- [Core Lightning Offers 文檔](https://docs.corelightning.org/docs/offers)
- [Bitcoin Optech: Offers](https://bitcoinops.org/en/topics/offers/)
