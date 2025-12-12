---
layout: post
title: 'Nostr 協議深度解析：去中心化社交網路的未來'
date: 2025-02-20
categories:
- nostr
- decentralization
description: 深入解析 Nostr 協議的技術架構、NIP 規範、生態系統發展，以及與閃電網路的整合。
image: /img/nostr.svg
published: true
hero_image: /img/hero.png
tags:
- nostr
- decentralization
- social
- lightning
- zaps
---

## 前言

在中心化社交媒體審查日益嚴重的今天，**Nostr**（Notes and Other Stuff Transmitted by Relays）提供了一個極簡但強大的去中心化替代方案。由比特幣開發者 fiatjaf 於 2020 年創建，Nostr 已經發展成為一個蓬勃的生態系統。

---

## 一、Nostr 基礎架構

### 核心設計原則

```
簡單 > 複雜
開放 > 封閉
抗審查 > 效率
用戶控制 > 平台控制
```

### 三個核心組件

| 組件 | 功能 | 類比 |
|------|------|------|
| **密鑰對** | 用戶身份 | 用戶名 + 密碼 |
| **事件** | 所有數據 | 推文、消息等 |
| **中繼站** | 數據存儲和分發 | 服務器 |

### 為什麼這麼簡單？

```
傳統社交網路：
  - 用戶名/密碼 → 平台驗證
  - 數據存儲 → 平台數據庫
  - 社交圖譜 → 平台控制

Nostr：
  - 公私鑰 → 數學驗證
  - 數據存儲 → 任意中繼站
  - 社交圖譜 → 用戶自己的跟隨列表
```

---

## 二、身份系統

### 公私鑰對

```
私鑰（nsec）：
nsec1vl029mgpspedva04g90vltkh6fvh240zqtv9k0t9af8935ke9laqsnlfe5

公鑰（npub）：
npub10elfcs4fr0l0heckmvxl08qpxvcpl7e6fhqm5l8yg5n0c30vcxjs6rjhth
```

**關鍵特性：**
- 私鑰 = 你的身份控制權
- 公鑰 = 你的用戶 ID
- 不需要任何平台驗證

### NIP-05 驗證

人類可讀的身份驗證：

```
格式：name@domain.com

驗證流程：
1. 客戶端查詢：https://domain.com/.well-known/nostr.json?name=alice
2. 服務器返回：{"names": {"alice": "<公鑰>"}}
3. 客戶端驗證公鑰匹配
```

**範例：**
```
jack@cash.app
fiatjaf@fiatjaf.com
```

### 密鑰安全

```
最佳實踐：
1. 使用硬體簽名器（如 Nostr 支援的硬體錢包）
2. 使用 NIP-46 遠端簽名
3. 永遠不要在網頁中輸入 nsec
4. 備份助記詞（如果錢包支援）
```

---

## 三、事件結構

### 基本事件格式

```json
{
  "id": "<32-bytes sha256 of the serialized event data>",
  "pubkey": "<32-bytes hex public key>",
  "created_at": "<unix timestamp>",
  "kind": "<integer>",
  "tags": [
    ["e", "<event_id>", "<relay_url>"],
    ["p", "<pubkey>", "<relay_url>"]
  ],
  "content": "<string>",
  "sig": "<64-bytes signature>"
}
```

### 事件類型 (Kind)

| Kind | 類型 | 說明 |
|------|------|------|
| 0 | Metadata | 用戶資料 |
| 1 | Short Text Note | 推文/貼文 |
| 2 | Recommend Relay | 中繼站推薦 |
| 3 | Contacts | 跟隨列表 |
| 4 | Encrypted DM | 加密私訊 |
| 5 | Event Deletion | 刪除請求 |
| 6 | Repost | 轉發 |
| 7 | Reaction | 反應（like 等） |
| 9735 | Zap | 閃電網路打賞 |
| 30023 | Long-form | 長文 |

### 標籤系統

```json
"tags": [
  ["e", "<event_id>"],     // 引用事件
  ["p", "<pubkey>"],       // 提及用戶
  ["t", "bitcoin"],        // 主題標籤
  ["r", "https://..."],    // URL 引用
  ["a", "<coordinate>"]    // 可替換事件引用
]
```

---

## 四、中繼站（Relays）

### 中繼站角色

```
客戶端 ←──WebSocket──→ 中繼站 ←──WebSocket──→ 其他客戶端

中繼站功能：
1. 接收並存儲事件
2. 響應訂閱請求
3. 轉發符合條件的事件
```

### 中繼站多樣性

| 類型 | 例子 | 特點 |
|------|------|------|
| **公共中繼站** | relay.damus.io | 開放、免費 |
| **付費中繼站** | relay.nostr.band | 減少垃圾訊息 |
| **私有中繼站** | 自建 | 完全控制 |
| **專用中繼站** | 特定社區 | 主題聚焦 |

### 訂閱過濾器

```json
{
  "ids": ["<event_id>", ...],
  "authors": ["<pubkey>", ...],
  "kinds": [1, 6, 7],
  "#e": ["<event_id>", ...],
  "#p": ["<pubkey>", ...],
  "since": <timestamp>,
  "until": <timestamp>,
  "limit": 100
}
```

### 運行自己的中繼站

```bash
# 使用 strfry（高性能）
git clone https://github.com/hoytech/strfry
cd strfry && make
./strfry relay

# 使用 nostr-rs-relay（Rust）
cargo install nostr-rs-relay
nostr-rs-relay --config config.toml
```

---

## 五、重要 NIP 規範

### NIP-01: 基本協議

定義了事件格式和中繼站通訊協議。

### NIP-04: 加密私訊（已棄用）

```
使用 ECDH 共享秘密 + AES-256-CBC

問題：
- 元數據洩漏（誰和誰通訊）
- 已被 NIP-44 取代
```

### NIP-44: 新加密標準

```
改進：
- XChaCha20-Poly1305
- 填充隱藏消息長度
- 更好的前向保密
```

### NIP-57: Zaps（閃電打賞）

```
流程：
1. 客戶端創建 zap request 事件
2. 發送到接收者的 LNURL 服務
3. 服務返回 invoice
4. 用戶支付
5. 服務發布 zap receipt（kind 9735）
```

### NIP-05: DNS 身份

將 npub 映射到人類可讀的標識符。

### NIP-07: 瀏覽器擴展

```javascript
// 網頁可以請求簽名
const pubkey = await window.nostr.getPublicKey();
const sig = await window.nostr.signEvent(event);
```

### NIP-46: Nostr Connect

遠端簽名協議，私鑰不離開安全環境。

---

## 六、閃電網路整合

### Zaps 機制

```
                    ┌──────────────┐
                    │  Nostr 客戶端 │
                    └──────┬───────┘
                           │ 1. 創建 zap request
                           ▼
                    ┌──────────────┐
                    │ LNURL 服務器 │
                    └──────┬───────┘
                           │ 2. 返回 invoice
                           ▼
                    ┌──────────────┐
                    │  用戶支付    │
                    └──────┬───────┘
                           │ 3. 支付成功
                           ▼
                    ┌──────────────┐
                    │ 發布 zap     │
                    │ receipt 事件 │
                    └──────────────┘
```

### 閃電地址

```
格式：username@domain.com

解析流程：
1. 查詢 https://domain.com/.well-known/lnurlp/username
2. 獲取 LNURL-pay 端點
3. 請求 invoice
4. 支付
```

### Zap 類型

| 類型 | 說明 |
|------|------|
| **Public Zap** | 公開顯示發送者和金額 |
| **Private Zap** | 金額公開，發送者私密 |
| **Anonymous Zap** | 完全匿名 |

---

## 七、客戶端生態

### 網頁客戶端

| 客戶端 | 特點 | URL |
|--------|------|-----|
| **Snort** | 功能豐富 | snort.social |
| **Primal** | 快速、現代 | primal.net |
| **Coracle** | 隱私聚焦 | coracle.social |
| **Iris** | 簡潔 | iris.to |

### 移動應用

**iOS:**
- **Damus** - 最流行
- **Primal** - 跨平台
- **Nos** - 注重體驗

**Android:**
- **Amethyst** - 功能最完整
- **Primal** - 跨平台
- **Plebstr** - 簡單

### 特殊用途客戶端

| 客戶端 | 用途 |
|--------|------|
| **Habla** | 長文寫作 |
| **Zap.stream** | 直播 |
| **Wavlake** | 音樂 |
| **Stemstr** | 音樂協作 |
| **Nostrgram** | 圖片 |

---

## 八、開發指南

### JavaScript/TypeScript

```javascript
import { SimplePool, getEventHash, signEvent } from 'nostr-tools';

// 創建事件
const event = {
  kind: 1,
  pubkey: publicKey,
  created_at: Math.floor(Date.now() / 1000),
  tags: [],
  content: 'Hello Nostr!'
};

event.id = getEventHash(event);
event.sig = signEvent(event, privateKey);

// 發布到中繼站
const pool = new SimplePool();
await pool.publish(['wss://relay.damus.io'], event);
```

### NDK (Nostr Dev Kit)

```typescript
import NDK, { NDKEvent } from '@nostr-dev-kit/ndk';

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io']
});
await ndk.connect();

const event = new NDKEvent(ndk);
event.kind = 1;
event.content = 'Hello from NDK!';
await event.sign();
await event.publish();
```

### Rust

```rust
use nostr_sdk::prelude::*;

#[tokio::main]
async fn main() {
    let keys = Keys::generate();
    let client = Client::new(&keys);

    client.add_relay("wss://relay.damus.io").await?;
    client.connect().await;

    client.publish_text_note("Hello Nostr!", []).await?;
}
```

---

## 九、隱私考量

### 元數據暴露

```
即使內容加密，以下仍可見：
- 時間戳
- 公鑰（身份）
- 中繼站（位置關聯）
- 交互模式
```

### 緩解措施

1. **使用多個身份** - 不同用途不同 npub
2. **私有中繼站** - 限制數據分發
3. **Tor 連接** - 隱藏 IP
4. **NIP-44** - 更好的消息加密

### 與比特幣比較

```
比特幣隱私挑戰：
- 交易圖分析
- 地址重用

Nostr 隱私挑戰：
- 社交圖分析
- 中繼站日誌

共同解決方向：
- 最小化數據暴露
- 使用增強隱私工具
```

---

## 十、挑戰與未來

### 當前挑戰

| 挑戰 | 說明 |
|------|------|
| **垃圾訊息** | 開放網路易受攻擊 |
| **內容審核** | 去中心化如何處理 |
| **用戶體驗** | 密鑰管理複雜 |
| **可擴展性** | 中繼站負載 |

### 解決方向

**垃圾訊息：**
- 付費中繼站
- 信譽系統（WoT）
- 工作量證明

**內容審核：**
- 客戶端過濾
- 社區中繼站
- 用戶屏蔽列表

### 未來發展

1. **NIP 演進** - 更多功能標準化
2. **更好的 UX** - 簡化密鑰管理
3. **跨平台** - 更多應用類型
4. **比特幣整合** - 更深的閃電整合

---

## 結論

Nostr 代表了社交網路的範式轉移：

1. **真正的所有權** - 你的密鑰，你的身份
2. **抗審查** - 沒有單一控制點
3. **互操作性** - 一個身份，多個客戶端
4. **比特幣原生** - 閃電網路深度整合

作為密碼龐克精神的體現，Nostr 證明了去中心化社交網路是可能的。雖然仍有挑戰，但其簡潔的設計和活躍的社區讓它成為最有希望的替代方案之一。

---

## 參考資料

- [Nostr 協議](https://github.com/nostr-protocol/nostr)
- [NIPs 規範庫](https://github.com/nostr-protocol/nips)
- [nostr.how](https://nostr.how/) - 入門指南
- [Awesome Nostr](https://github.com/aljazceru/awesome-nostr) - 資源列表
- [nostr.band](https://nostr.band/) - 統計和搜索
