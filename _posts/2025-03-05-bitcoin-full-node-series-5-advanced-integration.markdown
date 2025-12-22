---
layout: post
title: '從零開始的比特幣全節點（五）：進階功能與生態整合'
date: 2025-03-05
categories:
- 技術教學
- bitcoin
- tutorial
description: 比特幣全節點教程系列最終篇，詳細講解閃電網路整合、Electrum 伺服器、mempool 區塊瀏覽器、BTCPay Server 等進階應用。
image: /img/full-node.svg
published: true
hero_image: /img/hero.png
series: bitcoin-full-node
tags:
- bitcoin
- full-node
- tutorial
- lightning
- electrum
- btcpay
---

## 系列導言

這是「從零開始的比特幣全節點」系列教程的最終篇。本篇將探討如何在全節點基礎上整合各種進階功能，打造完整的比特幣主權堆疊（Sovereign Stack）。

**系列文章：**
1. [為什麼要運行全節點？](/bitcoin/tutorial/2025/03/01/bitcoin-full-node-series-1-why-run-node/)
2. [硬體選擇與環境準備](/bitcoin/tutorial/2025/03/02/bitcoin-full-node-series-2-hardware-setup/)
3. [Bitcoin Core 安裝與配置](/bitcoin/tutorial/2025/03/03/bitcoin-full-node-series-3-bitcoin-core-setup/)
4. [節點安全與日常維護](/bitcoin/tutorial/2025/03/04/bitcoin-full-node-series-4-security-maintenance/)
5. **進階功能與生態整合**（本篇）

---

## 一、主權堆疊概覽

### 什麼是主權堆疊？

```
主權堆疊（Sovereign Stack）：

┌─────────────────────────────────────┐
│         應用層                      │
│  BTCPay Server / Specter / Sparrow  │
├─────────────────────────────────────┤
│         錢包服務層                   │
│       Electrum Server               │
├─────────────────────────────────────┤
│         閃電網路層                   │
│     LND / Core Lightning / LDK      │
├─────────────────────────────────────┤
│         區塊鏈層                     │
│         Bitcoin Core                │
├─────────────────────────────────────┤
│         隱私層                       │
│           Tor                       │
└─────────────────────────────────────┘
```

### 本篇涵蓋的整合

| 組件 | 功能 | 難度 |
|------|------|------|
| 閃電網路 (LND) | 快速支付 | 中 |
| Electrum Server | 錢包後端 | 中 |
| mempool | 區塊瀏覽器 | 中 |
| BTCPay Server | 商家支付 | 高 |
| Specter Desktop | 多簽錢包 | 低 |

---

## 二、閃電網路整合

### 2.1 前置需求

```bash
# Bitcoin Core 配置需要添加：
# 編輯 ~/.bitcoin/bitcoin.conf

# ZMQ 端點（閃電網路需要）
zmqpubrawblock=tcp://127.0.0.1:28332
zmqpubrawtx=tcp://127.0.0.1:28333

# 交易索引（某些操作需要）
txindex=1

# 重啟 Bitcoin Core
sudo systemctl restart bitcoind
```

### 2.2 安裝 LND

```bash
# 下載 LND
VERSION=0.17.0-beta
wget https://github.com/lightningnetwork/lnd/releases/download/v${VERSION}/lnd-linux-amd64-v${VERSION}.tar.gz

# 驗證（省略 GPG 步驟，實際使用時請驗證）
tar -xzf lnd-linux-amd64-v${VERSION}.tar.gz

# 安裝
sudo install -m 0755 -o root -g root -t /usr/local/bin lnd-linux-amd64-v${VERSION}/*
```

### 2.3 配置 LND

```bash
# 建立配置目錄
mkdir -p ~/.lnd

# 建立配置文件
nano ~/.lnd/lnd.conf
```

```ini
[Application Options]
# 節點別名
alias=MyNode

# 監聽地址
listen=0.0.0.0:9735

# RPC 監聽
rpclisten=localhost:10009

# 日誌等級
debuglevel=info

# 資料目錄
datadir=~/.lnd/data

# 日誌目錄
logdir=~/.lnd/logs

[Bitcoin]
# 使用比特幣主網
bitcoin.mainnet=true

# 使用 Bitcoin Core 後端
bitcoin.node=bitcoind

[Bitcoind]
# Bitcoin Core RPC 設定
bitcoind.rpchost=127.0.0.1
bitcoind.rpcuser=your_rpc_user
bitcoind.rpcpass=your_rpc_password

# ZMQ 端點
bitcoind.zmqpubrawblock=tcp://127.0.0.1:28332
bitcoind.zmqpubrawtx=tcp://127.0.0.1:28333

[Tor]
# 通過 Tor 運行
tor.active=true
tor.v3=true
```

### 2.4 啟動 LND

```bash
# 首次啟動（前台）
lnd

# 另開終端，建立錢包
lncli create
# 按照提示設定密碼並備份種子詞

# 或者使用 systemd 服務
sudo nano /etc/systemd/system/lnd.service
```

```ini
[Unit]
Description=LND Lightning Network Daemon
After=bitcoind.service
Requires=bitcoind.service

[Service]
Type=simple
User=bitcoin
ExecStart=/usr/local/bin/lnd
ExecStop=/usr/local/bin/lncli stop
Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
```

```bash
# 啟用服務
sudo systemctl daemon-reload
sudo systemctl enable lnd
sudo systemctl start lnd

# 解鎖錢包（每次重啟後需要）
lncli unlock
```

### 2.5 基本 LND 操作

```bash
# 查看節點資訊
lncli getinfo

# 生成新地址（充值）
lncli newaddress p2wkh

# 查看餘額
lncli walletbalance

# 連接節點
lncli connect <pubkey>@<host>:<port>

# 開啟通道
lncli openchannel --node_key=<pubkey> --local_amt=100000

# 查看通道
lncli listchannels

# 創建 invoice
lncli addinvoice --amt=1000 --memo="test payment"

# 支付 invoice
lncli payinvoice <payment_request>
```

---

## 三、Electrum Server

### 3.1 為什麼需要 Electrum Server？

```
直接使用 Bitcoin Core RPC：
└── 只能查詢本機錢包，功能有限

使用公共 Electrum 伺服器：
└── 隱私洩漏！伺服器知道你的所有地址

使用自己的 Electrum Server：
├── 完全私密
├── 支援 Electrum、Sparrow 等錢包
└── 查詢任意地址
```

### 3.2 安裝 Electrs（推薦）

```bash
# 安裝 Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 安裝依賴
sudo apt install clang cmake build-essential

# 下載 electrs
git clone https://github.com/romanz/electrs
cd electrs

# 編譯（需要一些時間）
cargo build --locked --release

# 安裝
sudo install -m 0755 target/release/electrs /usr/local/bin/
```

### 3.3 配置 Electrs

```bash
# 建立配置目錄
mkdir -p ~/.electrs

# 建立配置文件
nano ~/.electrs/config.toml
```

```toml
# Electrs 配置

# Bitcoin Core 數據目錄
daemon_dir = "/mnt/bitcoin/bitcoind"

# Electrs 數據目錄
db_dir = "/mnt/bitcoin/electrs"

# Bitcoin Core RPC
daemon_rpc_addr = "127.0.0.1:8332"

# 認證
auth = "your_rpc_user:your_rpc_password"

# Electrum RPC 監聽
electrum_rpc_addr = "0.0.0.0:50001"

# 日誌等級
log_filters = "INFO"

# 網路
network = "bitcoin"
```

### 3.4 首次索引

```bash
# 首次運行需要建立索引（可能需要數小時）
electrs --conf ~/.electrs/config.toml

# 監控進度
# 完成後會顯示 "serving Electrum requests"
```

### 3.5 Electrs Systemd 服務

```bash
sudo nano /etc/systemd/system/electrs.service
```

```ini
[Unit]
Description=Electrs Electrum Server
After=bitcoind.service
Requires=bitcoind.service

[Service]
Type=simple
User=bitcoin
ExecStart=/usr/local/bin/electrs --conf /home/bitcoin/.electrs/config.toml
Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable electrs
sudo systemctl start electrs
```

### 3.6 連接錢包

**Electrum 錢包：**

```
工具 → 網路 → 伺服器
輸入：your-node-ip:50001
取消勾選「選擇自動伺服器」
```

**Sparrow 錢包：**

```
檔案 → 偏好設定 → 伺服器
選擇「Private Electrum Server」
輸入：your-node-ip:50001
```

---

## 四、Mempool 區塊瀏覽器

### 4.1 安裝 mempool

```bash
# 安裝依賴
sudo apt install mariadb-server mariadb-client nginx

# 安裝 Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

# 下載 mempool
git clone https://github.com/mempool/mempool.git
cd mempool
```

### 4.2 設定資料庫

```bash
# 進入 MariaDB
sudo mysql -u root

# 建立資料庫和用戶
CREATE DATABASE mempool;
CREATE USER 'mempool'@'localhost' IDENTIFIED BY 'mempool_password';
GRANT ALL PRIVILEGES ON mempool.* TO 'mempool'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4.3 配置後端

```bash
cd backend

# 安裝依賴
npm install

# 複製配置範本
cp mempool-config.sample.json mempool-config.json

# 編輯配置
nano mempool-config.json
```

```json
{
  "MEMPOOL": {
    "NETWORK": "mainnet",
    "BACKEND": "electrum",
    "HTTP_PORT": 8999,
    "SPAWN_CLUSTER_PROCS": 0,
    "API_URL_PREFIX": "/api/v1/"
  },
  "CORE_RPC": {
    "HOST": "127.0.0.1",
    "PORT": 8332,
    "USERNAME": "your_rpc_user",
    "PASSWORD": "your_rpc_password"
  },
  "ELECTRUM": {
    "HOST": "127.0.0.1",
    "PORT": 50001,
    "TLS_ENABLED": false
  },
  "DATABASE": {
    "ENABLED": true,
    "HOST": "127.0.0.1",
    "PORT": 3306,
    "DATABASE": "mempool",
    "USERNAME": "mempool",
    "PASSWORD": "mempool_password"
  }
}
```

### 4.4 配置前端

```bash
cd ../frontend

# 安裝依賴
npm install

# 複製配置
cp mempool-frontend-config.sample.json mempool-frontend-config.json

# 編輯配置（通常預設即可）
nano mempool-frontend-config.json

# 建構前端
npm run build
```

### 4.5 配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/mempool
```

```nginx
server {
    listen 80;
    server_name _;

    root /path/to/mempool/frontend/dist/mempool/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8999/api/;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mempool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4.6 啟動 Mempool

```bash
# 後端
cd backend
npm run start

# 使用 PM2 管理（推薦）
sudo npm install -g pm2
pm2 start npm --name "mempool-backend" -- run start
pm2 save
pm2 startup
```

訪問 `http://your-node-ip` 即可使用私有區塊瀏覽器。

---

## 五、BTCPay Server

### 5.1 使用 Docker 安裝

```bash
# 安裝 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker bitcoin

# 下載 BTCPay Server
git clone https://github.com/btcpayserver/btcpayserver-docker
cd btcpayserver-docker

# 設定環境變數
export BTCPAY_HOST="btcpay.your-domain.com"
export NBITCOIN_NETWORK="mainnet"
export BTCPAYGEN_CRYPTO1="btc"
export BTCPAYGEN_LIGHTNING="lnd"
export BTCPAYGEN_REVERSEPROXY="nginx"
export BTCPAY_ENABLE_SSH=true

# 啟動
./btcpay-setup.sh -i
```

### 5.2 連接外部 Bitcoin Core

如果要使用已有的 Bitcoin Core 而非 Docker 內建的：

```bash
# 設定環境變數
export BTCPAYGEN_EXCLUDE_FRAGMENTS="bitcoin"
export BTCPAY_BTCRPCHOST="host.docker.internal"
export BTCPAY_BTCRPCPORT="8332"
export BTCPAY_BTCRPCUSER="your_rpc_user"
export BTCPAY_BTCRPCPASSWORD="your_rpc_password"

# 重新設定
./btcpay-setup.sh -i
```

### 5.3 基本 BTCPay 設定

1. 訪問 `https://btcpay.your-domain.com`
2. 建立帳號
3. 建立商店
4. 設定錢包（連接硬體錢包或 xpub）
5. 設定閃電網路（連接 LND）

---

## 六、Specter Desktop

### 6.1 安裝 Specter

```bash
# 使用 pip 安裝
pip3 install cryptoadvance.specter

# 或使用預編譯版本
wget https://github.com/cryptoadvance/specter-desktop/releases/download/v2.0.0/specter_desktop-v2.0.0-x86_64-linux-gnu.tar.gz
tar -xzf specter_desktop-*.tar.gz
sudo mv specter* /usr/local/bin/
```

### 6.2 啟動 Specter

```bash
# 啟動（預設連接本地 Bitcoin Core）
specter server

# 指定 RPC 設定
specter server --rpc-user your_user --rpc-password your_password
```

訪問 `http://127.0.0.1:25441` 使用 Web 介面。

### 6.3 Specter 功能

- **多簽錢包設定**：支援多種硬體錢包
- **PSBT 簽名**：部分簽名交易
- **Coin Control**：UTXO 管理
- **地址驗證**：在硬體錢包上顯示地址

---

## 七、Tor 隱藏服務整合

### 7.1 為所有服務設定 Tor

```bash
# 編輯 Tor 配置
sudo nano /etc/tor/torrc

# 添加隱藏服務
HiddenServiceDir /var/lib/tor/bitcoin-service/
HiddenServicePort 8333 127.0.0.1:8333

HiddenServiceDir /var/lib/tor/electrs-service/
HiddenServicePort 50001 127.0.0.1:50001

HiddenServiceDir /var/lib/tor/lnd-service/
HiddenServicePort 9735 127.0.0.1:9735

HiddenServiceDir /var/lib/tor/mempool-service/
HiddenServicePort 80 127.0.0.1:80

# 重啟 Tor
sudo systemctl restart tor

# 獲取 .onion 地址
sudo cat /var/lib/tor/*/hostname
```

### 7.2 遠端安全訪問

```bash
# 通過 Tor 連接 Electrum
electrum --oneserver --server your-onion-address.onion:50001:t

# 通過 Tor 訪問 mempool
# 在 Tor Browser 中訪問 your-onion-address.onion
```

---

## 八、節點套裝方案

如果手動設定太複雜，可以考慮使用預配置的節點套裝：

### Umbrel

```bash
# 安裝 Umbrel
curl -L https://umbrel.sh | bash

# 訪問 http://umbrel.local
# 通過 App Store 安裝各種應用
```

### Start9

```bash
# Start9 提供預裝系統
# 下載 ISO 或購買預裝硬體
# https://start9.com
```

### RaspiBlitz

```bash
# 專為 Raspberry Pi 設計
git clone https://github.com/rootzoll/raspiblitz.git
cd raspiblitz
# 按照說明安裝
```

---

## 九、維護和監控

### 統一狀態檢查腳本

```bash
#!/bin/bash
# 儲存為 /home/bitcoin/stack-status.sh

echo "╔════════════════════════════════════════╗"
echo "║      Bitcoin Sovereign Stack Status     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Bitcoin Core
echo "【Bitcoin Core】"
if systemctl is-active --quiet bitcoind; then
    BLOCKS=$(bitcoin-cli getblockcount 2>/dev/null)
    CONN=$(bitcoin-cli getconnectioncount 2>/dev/null)
    echo "  狀態: 運行中 ✓"
    echo "  區塊: $BLOCKS"
    echo "  連接: $CONN"
else
    echo "  狀態: 已停止 ✗"
fi
echo ""

# LND
echo "【LND】"
if systemctl is-active --quiet lnd; then
    ALIAS=$(lncli getinfo 2>/dev/null | jq -r '.alias')
    CHANNELS=$(lncli listchannels 2>/dev/null | jq '.channels | length')
    echo "  狀態: 運行中 ✓"
    echo "  別名: $ALIAS"
    echo "  通道: $CHANNELS"
else
    echo "  狀態: 已停止 ✗"
fi
echo ""

# Electrs
echo "【Electrs】"
if systemctl is-active --quiet electrs; then
    echo "  狀態: 運行中 ✓"
else
    echo "  狀態: 已停止 ✗"
fi
echo ""

# Mempool
echo "【Mempool】"
if pm2 show mempool-backend &>/dev/null; then
    echo "  狀態: 運行中 ✓"
else
    echo "  狀態: 已停止 ✗"
fi
echo ""

# Tor
echo "【Tor】"
if systemctl is-active --quiet tor; then
    echo "  狀態: 運行中 ✓"
else
    echo "  狀態: 已停止 ✗"
fi
echo ""

# 系統資源
echo "【系統資源】"
echo "  CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')%"
echo "  記憶體: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "  磁碟: $(df -h /mnt/bitcoin | awk 'NR==2 {print $3 "/" $2}')"
```

---

## 十、總結與下一步

### 完成的主權堆疊

恭喜！完成本系列後，你擁有了：

```
✅ Bitcoin Core 全節點
   └── 獨立驗證所有交易

✅ LND 閃電網路節點
   └── 即時支付能力

✅ Electrum Server
   └── 私密錢包後端

✅ Mempool 區塊瀏覽器
   └── 私密交易查詢

✅ Tor 整合
   └── 網路層隱私

✅ 完整備份和監控
   └── 持續運營能力
```

### 進階學習方向

1. **閃電網路進階**
   - 路由優化
   - 流動性管理
   - Loop In/Out

2. **隱私技術**
   - CoinJoin
   - PayJoin
   - Silent Payments

3. **多重簽名**
   - 2-of-3 設定
   - 分散式密鑰管理
   - 繼承規劃

4. **開發**
   - Bitcoin Script
   - LN 應用開發
   - BTCPay 整合

---

## 參考資料

- [LND 文檔](https://docs.lightning.engineering/)
- [Electrs GitHub](https://github.com/romanz/electrs)
- [Mempool 文檔](https://mempool.space/docs/)
- [BTCPay Server 文檔](https://docs.btcpayserver.org/)
- [Specter Desktop](https://specter.solutions/)
- [Ministry of Nodes](https://www.youtube.com/@MinistryOfNodes) - 教學影片
- [Bitcoin Sovereignty Stack](https://bitcoinmagazine.com/guides/bitcoin-sovereignty-stack)

---

## 系列完結

感謝你跟隨這個系列教程！運行自己的比特幣全節點是實踐密碼龐克精神的重要一步。

> "Cypherpunks write code."
> — Eric Hughes

現在，你不只是使用比特幣，你是比特幣網路的一部分。
