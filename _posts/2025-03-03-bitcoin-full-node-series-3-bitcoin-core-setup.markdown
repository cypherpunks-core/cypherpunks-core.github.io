---
layout: post
title: '從零開始的比特幣全節點（三）：Bitcoin Core 安裝與配置'
date: 2025-03-03
categories:
- 技術教學
- bitcoin
- tutorial
description: 比特幣全節點教程系列第三篇，詳細講解 Bitcoin Core 的下載驗證、安裝配置、初始同步，以及 systemd 服務設定。
image: /img/full-node.svg
published: true
hero_image: /img/hero.png
series: bitcoin-full-node
tags:
- bitcoin
- full-node
- tutorial
- bitcoin-core
- configuration
---

## 系列導言

這是「從零開始的比特幣全節點」系列教程的第三篇。本篇將帶你完成 Bitcoin Core 的安裝、配置和初始同步。

**系列文章：**
1. [為什麼要運行全節點？](/bitcoin/tutorial/2025/03/01/bitcoin-full-node-series-1-why-run-node/)
2. [硬體選擇與環境準備](/bitcoin/tutorial/2025/03/02/bitcoin-full-node-series-2-hardware-setup/)
3. **Bitcoin Core 安裝與配置**（本篇）
4. 節點安全與日常維護
5. 進階功能與生態整合

---

## 一、下載 Bitcoin Core

### 獲取最新版本

```bash
# 建立工作目錄
mkdir -p ~/bitcoin-core && cd ~/bitcoin-core

# 查看最新版本（寫作時為 27.0）
# https://bitcoincore.org/en/releases/

# 設定版本變數
VERSION=27.0

# 下載二進制文件（根據架構選擇）

# x86_64 (Intel/AMD 64-bit)
wget https://bitcoincore.org/bin/bitcoin-core-${VERSION}/bitcoin-${VERSION}-x86_64-linux-gnu.tar.gz

# ARM64 (Raspberry Pi 4/5, Apple Silicon)
wget https://bitcoincore.org/bin/bitcoin-core-${VERSION}/bitcoin-${VERSION}-aarch64-linux-gnu.tar.gz

# 下載簽名文件
wget https://bitcoincore.org/bin/bitcoin-core-${VERSION}/SHA256SUMS
wget https://bitcoincore.org/bin/bitcoin-core-${VERSION}/SHA256SUMS.asc
```

### 驗證下載完整性

**這一步非常重要！** 確保你下載的是官方未被篡改的版本。

**步驟 1：驗證 SHA256 校驗和**

```bash
# 計算下載文件的校驗和並比對
sha256sum --ignore-missing --check SHA256SUMS

# 應該看到：
# bitcoin-27.0-x86_64-linux-gnu.tar.gz: OK
```

**步驟 2：驗證 GPG 簽名**

```bash
# 安裝 GPG（如未安裝）
sudo apt install gnupg

# 獲取 Bitcoin Core 開發者公鑰
# 方法一：從 bitcoin-core/guix.sigs 獲取
git clone https://github.com/bitcoin-core/guix.sigs.git
gpg --import guix.sigs/builder-keys/*

# 方法二：從 keyserver 獲取特定開發者密鑰
gpg --keyserver hkps://keys.openpgp.org --recv-keys \
  0CCBAAFD76A2ECE2CCD3141DE2FFD5B1D88CA97D  # Pieter Wuille

# 驗證簽名
gpg --verify SHA256SUMS.asc SHA256SUMS

# 應該看到：
# gpg: Good signature from "Pieter Wuille <...>"
# 可能有 WARNING 關於未建立信任，這是正常的
```

### 安裝 Bitcoin Core

```bash
# 解壓縮
tar -xzf bitcoin-${VERSION}-*.tar.gz

# 安裝到系統
sudo install -m 0755 -o root -g root -t /usr/local/bin bitcoin-${VERSION}/bin/*

# 驗證安裝
bitcoind --version
# Bitcoin Core version v27.0

bitcoin-cli --version
# Bitcoin Core RPC client version v27.0
```

---

## 二、建立配置結構

### 目錄結構

```bash
# 建立數據目錄（使用 SSD 掛載點）
mkdir -p /mnt/bitcoin/bitcoind

# 建立配置目錄
mkdir -p ~/.bitcoin

# 目錄結構說明：
# ~/.bitcoin/           - 配置文件位置
#   ├── bitcoin.conf    - 主配置文件
#   └── wallets/        - 錢包目錄（如需要）
#
# /mnt/bitcoin/bitcoind/ - 區塊鏈數據位置
#   ├── blocks/         - 區塊數據
#   ├── chainstate/     - UTXO 數據庫
#   └── indexes/        - 索引數據
```

### 基本配置文件

```bash
# 建立配置文件
nano ~/.bitcoin/bitcoin.conf
```

**基本配置（適合大多數用戶）：**

```ini
# Bitcoin Core 配置文件
# ~/.bitcoin/bitcoin.conf

# ==================
# 網路設定
# ==================

# 主網（生產環境）
# chain=main

# 測試網（學習用）
# chain=test

# Signet（開發測試）
# chain=signet

# ==================
# 數據目錄
# ==================

# 區塊鏈數據位置（指向 SSD）
datadir=/mnt/bitcoin/bitcoind

# ==================
# 連接設定
# ==================

# 監聽外部連接
listen=1

# 最大連接數
maxconnections=40

# 最大上傳限制（MB/天，0=無限制）
maxuploadtarget=5000

# ==================
# 效能設定
# ==================

# 資料庫快取大小（MB）
# RAM <= 4GB: 設定 300
# RAM 8GB: 設定 450
# RAM >= 16GB: 設定 1000
dbcache=450

# ==================
# RPC 設定
# ==================

# 啟用 RPC 伺服器
server=1

# RPC 認證（使用下面的命令生成）
# python3 share/rpcauth/rpcauth.py <username>
rpcauth=bitcoinrpc:salt$hash

# 允許 RPC 連接的 IP（本機）
rpcbind=127.0.0.1
rpcallowip=127.0.0.1

# ==================
# 交易索引（可選）
# ==================

# 啟用交易索引（需要更多空間，某些應用需要）
# txindex=1

# ==================
# 修剪模式（可選）
# ==================

# 啟用修剪模式（單位：MB，最小 550）
# prune=1000

# ==================
# Tor 設定（推薦）
# ==================

# 通過 Tor 連接
proxy=127.0.0.1:9050

# 監聽 Tor 隱藏服務
# listenonion=1

# ==================
# ZMQ 推送（可選，閃電網路需要）
# ==================

# zmqpubrawblock=tcp://127.0.0.1:28332
# zmqpubrawtx=tcp://127.0.0.1:28333
```

### 生成 RPC 認證

```bash
# 下載認證腳本
wget https://raw.githubusercontent.com/bitcoin/bitcoin/master/share/rpcauth/rpcauth.py

# 生成認證資訊
python3 rpcauth.py myusername

# 輸出範例：
# String to be appended to bitcoin.conf:
# rpcauth=myusername:salt$hash
#
# Your password:
# your_generated_password

# 將 rpcauth 行添加到 bitcoin.conf
# 安全保存密碼
```

---

## 三、配置詳解

### 修剪模式 vs 完整模式

**完整模式：**

```ini
# 保留所有區塊數據（~600GB+）
# 不添加 prune 選項即可

# 可選：啟用交易索引
txindex=1
```

**修剪模式：**

```ini
# 只保留最近的區塊，大幅減少空間
# 數值為保留的 MB 數（最小 550）
prune=1000

# 注意：修剪模式不能使用 txindex
# txindex=1  # 這會與 prune 衝突
```

| 模式 | 空間需求 | 功能限制 |
|------|---------|---------|
| 完整 | ~650GB | 無 |
| 完整+索引 | ~700GB | 無 |
| 修剪 (1GB) | ~1-2GB | 無法查詢舊交易、無法幫助新節點同步 |
| 修剪 (10GB) | ~10-12GB | 同上 |

### 記憶體配置

```ini
# dbcache - UTXO 快取大小
# 更大的快取 = 更快的同步，但佔用更多 RAM

# RAM 配置建議：
# 2GB 系統：dbcache=300
# 4GB 系統：dbcache=450
# 8GB 系統：dbcache=1000
# 16GB+ 系統：dbcache=2000
```

### 網路配置

```ini
# 最大連接數
# 更多連接 = 更好的網路貢獻
# 但會使用更多頻寬和資源
maxconnections=40

# 上傳限制（每日 MB）
# 設定為 0 表示無限制
# 5000 = 約 5GB/天
maxuploadtarget=5000

# 如果在 NAT 後面且無法開放端口
# 仍然可以運行但只能建立出站連接
# listen=0
```

### Tor 配置

```ini
# 基本 Tor 代理（匿名出站連接）
proxy=127.0.0.1:9050

# 只通過 Tor 連接
onlynet=onion

# 啟用洋蔥服務（允許入站連接）
listenonion=1

# 同時使用 clearnet 和 Tor
# 不要設定 onlynet，兩者都會使用
```

---

## 四、首次啟動

### 手動啟動（測試用）

```bash
# 前台啟動（可以看到日誌）
bitcoind -printtoconsole

# 或後台啟動
bitcoind -daemon

# 查看日誌
tail -f /mnt/bitcoin/bitcoind/debug.log

# 檢查狀態
bitcoin-cli getblockchaininfo
```

### 初始區塊下載（IBD）

```
初始同步過程：

階段 1：區塊下載
├── 下載所有區塊頭（幾分鐘）
├── 下載區塊數據（幾小時到幾天）
└── 進度顯示：XX% complete

階段 2：區塊驗證
├── 驗證每個交易
├── 建立 UTXO 集
└── 這是最耗時的部分

階段 3：索引建立（如啟用）
├── 建立交易索引
└── 額外需要幾小時
```

### 監控同步進度

```bash
# 查看同步狀態
bitcoin-cli getblockchaininfo

# 重要欄位：
# "blocks": 當前已驗證的區塊高度
# "headers": 已知的最高區塊高度
# "verificationprogress": 驗證進度（0-1）
# "initialblockdownload": 是否還在初始同步

# 進度百分比
bitcoin-cli getblockchaininfo | grep verificationprogress
# "verificationprogress": 0.9999...

# 簡易進度腳本
watch -n 60 'bitcoin-cli getblockchaininfo | grep -E "blocks|headers|progress"'
```

### 同步時間預估

| 硬體 | 網路 | 預估時間 |
|------|------|---------|
| Pi 4 + SATA SSD | 100 Mbps | 5-7 天 |
| 迷你 PC + NVMe | 100 Mbps | 1-3 天 |
| 高性能 PC + NVMe | 1 Gbps | 6-12 小時 |

**加速同步的技巧：**

```bash
# 初始同步時暫時增加 dbcache
bitcoind -dbcache=2000

# 同步完成後改回正常值
# 修改 bitcoin.conf 並重啟
```

---

## 五、設定 Systemd 服務

### 建立服務文件

```bash
sudo nano /etc/systemd/system/bitcoind.service
```

```ini
[Unit]
Description=Bitcoin Core Daemon
Documentation=https://bitcoincore.org/en/doc/
After=network-online.target
Wants=network-online.target

[Service]
Type=forking
User=bitcoin
Group=bitcoin

# 環境變數
Environment="HOME=/home/bitcoin"

# 啟動命令
ExecStart=/usr/local/bin/bitcoind -daemon -conf=/home/bitcoin/.bitcoin/bitcoin.conf -pid=/run/bitcoind/bitcoind.pid

# 停止命令
ExecStop=/usr/local/bin/bitcoin-cli stop

# PID 文件
PIDFile=/run/bitcoind/bitcoind.pid

# 運行時目錄
RuntimeDirectory=bitcoind
RuntimeDirectoryMode=0710

# 資源限制
LimitNOFILE=65535

# 自動重啟
Restart=on-failure
RestartSec=30

# 停止超時
TimeoutStopSec=600

[Install]
WantedBy=multi-user.target
```

### 建立專用用戶（推薦）

```bash
# 建立 bitcoin 系統用戶
sudo useradd -r -m -s /bin/bash bitcoin

# 設定目錄權限
sudo chown -R bitcoin:bitcoin /mnt/bitcoin/bitcoind
sudo chown -R bitcoin:bitcoin /home/bitcoin/.bitcoin

# 複製配置
sudo cp ~/.bitcoin/bitcoin.conf /home/bitcoin/.bitcoin/
sudo chown bitcoin:bitcoin /home/bitcoin/.bitcoin/bitcoin.conf
```

### 啟用服務

```bash
# 重新載入 systemd
sudo systemctl daemon-reload

# 啟用開機自動啟動
sudo systemctl enable bitcoind

# 啟動服務
sudo systemctl start bitcoind

# 檢查狀態
sudo systemctl status bitcoind

# 查看日誌
sudo journalctl -u bitcoind -f
```

### 服務管理命令

```bash
# 啟動
sudo systemctl start bitcoind

# 停止
sudo systemctl stop bitcoind

# 重啟
sudo systemctl restart bitcoind

# 查看狀態
sudo systemctl status bitcoind

# 查看日誌
sudo journalctl -u bitcoind -f

# 查看最近 100 行日誌
sudo journalctl -u bitcoind -n 100
```

---

## 六、基本操作

### bitcoin-cli 常用命令

**節點狀態：**

```bash
# 區塊鏈資訊
bitcoin-cli getblockchaininfo

# 網路資訊
bitcoin-cli getnetworkinfo

# 連接的節點
bitcoin-cli getpeerinfo

# 記憶體池資訊
bitcoin-cli getmempoolinfo
```

**區塊查詢：**

```bash
# 最新區塊高度
bitcoin-cli getblockcount

# 獲取區塊雜湊
bitcoin-cli getblockhash 100000

# 獲取區塊詳情
bitcoin-cli getblock <blockhash>

# 獲取區塊詳情（包含交易）
bitcoin-cli getblock <blockhash> 2
```

**交易查詢（需要 txindex=1）：**

```bash
# 獲取交易詳情
bitcoin-cli getrawtransaction <txid> true

# 解碼原始交易
bitcoin-cli decoderawtransaction <hex>
```

**錢包操作（如啟用）：**

```bash
# 建立錢包
bitcoin-cli createwallet "mywallet"

# 獲取新地址
bitcoin-cli getnewaddress

# 查看餘額
bitcoin-cli getbalance

# 列出交易
bitcoin-cli listtransactions
```

### 實用腳本

**同步進度監控：**

```bash
#!/bin/bash
# 儲存為 ~/bitcoin-progress.sh

while true; do
    clear
    echo "=== Bitcoin Core 同步狀態 ==="
    echo ""

    INFO=$(bitcoin-cli getblockchaininfo 2>/dev/null)

    if [ $? -eq 0 ]; then
        BLOCKS=$(echo $INFO | jq -r '.blocks')
        HEADERS=$(echo $INFO | jq -r '.headers')
        PROGRESS=$(echo $INFO | jq -r '.verificationprogress')
        IBD=$(echo $INFO | jq -r '.initialblockdownload')

        PERCENT=$(echo "$PROGRESS * 100" | bc -l | xargs printf "%.2f")

        echo "區塊高度: $BLOCKS / $HEADERS"
        echo "同步進度: $PERCENT%"
        echo "初始同步: $IBD"
        echo ""

        # 顯示連接數
        PEERS=$(bitcoin-cli getconnectioncount 2>/dev/null)
        echo "連接節點: $PEERS"
    else
        echo "Bitcoin Core 未運行或 RPC 無法連接"
    fi

    sleep 60
done
```

---

## 七、故障排除

### 常見問題

**問題 1：同步卡住**

```bash
# 檢查是否有錯誤
tail -100 /mnt/bitcoin/bitcoind/debug.log | grep -i error

# 可能原因：
# 1. 磁碟空間不足
# 2. 記憶體不足
# 3. 網路問題

# 解決方案：
# 1. 檢查空間：df -h
# 2. 檢查記憶體：free -h
# 3. 重啟服務：sudo systemctl restart bitcoind
```

**問題 2：RPC 無法連接**

```bash
# 錯誤：error: Could not connect to the server

# 檢查服務是否運行
sudo systemctl status bitcoind

# 檢查 RPC 配置
grep -E "rpc" ~/.bitcoin/bitcoin.conf

# 確認 rpcauth 設定正確
```

**問題 3：磁碟空間不足**

```bash
# 檢查使用情況
du -sh /mnt/bitcoin/bitcoind/*

# 選項 1：啟用修剪模式
# 在 bitcoin.conf 添加：prune=1000
# 注意：這需要重新同步

# 選項 2：擴展儲存空間
```

**問題 4：連接數很低**

```bash
# 檢查網路設定
bitcoin-cli getnetworkinfo | grep -E "connections|localaddresses"

# 如果都是出站連接：
# 1. 確認路由器端口轉發（8333）
# 2. 確認防火牆允許
# 3. 考慮使用 Tor
```

### 日誌分析

```bash
# 查看最近的錯誤
grep -i "error\|warning" /mnt/bitcoin/bitcoind/debug.log | tail -50

# 查看連接日誌
grep -i "connection\|peer" /mnt/bitcoin/bitcoind/debug.log | tail -20

# 查看區塊處理
grep -i "UpdateTip" /mnt/bitcoin/bitcoind/debug.log | tail -10
```

---

## 八、下一步

恭喜！你已經成功安裝並運行了 Bitcoin Core 全節點。在本系列的下一篇文章中，我們將討論：

- 節點安全強化
- 防火牆配置
- Tor 隱藏服務設定
- 備份和恢復
- 日常維護任務

---

## 參考資料

- [Bitcoin Core 官方文檔](https://bitcoincore.org/en/doc/)
- [bitcoin.conf 配置選項](https://jlopp.github.io/bitcoin-core-config-generator/)
- [Bitcoin Core RPC 文檔](https://developer.bitcoin.org/reference/rpc/)
- [驗證 Bitcoin Core 下載](https://bitcoincore.org/en/download/)
