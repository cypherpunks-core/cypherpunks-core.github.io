---
layout: post
title: '從零開始的比特幣全節點（四）：節點安全與日常維護'
date: 2025-03-04
categories:
- 技術教學
- bitcoin
- tutorial
description: 比特幣全節點教程系列第四篇，詳細講解節點安全強化、防火牆配置、Tor 隱藏服務、備份恢復策略，以及日常維護任務。
image: /img/full-node.svg
published: true
hero_image: /img/hero.png
series: bitcoin-full-node
tags:
- bitcoin
- full-node
- tutorial
- security
- tor
---

## 系列導言

這是「從零開始的比特幣全節點」系列教程的第四篇。本篇將深入探討如何保護你的節點安全，以及日常維護的最佳實踐。

**系列文章：**
1. [為什麼要運行全節點？](/bitcoin/tutorial/2025/03/01/bitcoin-full-node-series-1-why-run-node/)
2. [硬體選擇與環境準備](/bitcoin/tutorial/2025/03/02/bitcoin-full-node-series-2-hardware-setup/)
3. [Bitcoin Core 安裝與配置](/bitcoin/tutorial/2025/03/03/bitcoin-full-node-series-3-bitcoin-core-setup/)
4. **節點安全與日常維護**（本篇）
5. 進階功能與生態整合

---

## 一、系統安全基礎

### 1.1 系統更新

```bash
# 定期更新系統
sudo apt update && sudo apt upgrade -y

# 啟用自動安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# 設定自動更新配置
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

```
// 只自動安裝安全更新
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};

// 自動移除不需要的套件
Unattended-Upgrade::Remove-Unused-Dependencies "true";

// 自動重啟（如需要）
Unattended-Upgrade::Automatic-Reboot "false";
```

### 1.2 用戶安全

```bash
# 建立專用用戶（如尚未建立）
sudo useradd -r -m -s /bin/bash bitcoin

# 設定強密碼
sudo passwd bitcoin

# 限制 root 登入
sudo passwd -l root

# 將管理員加入 sudo 群組
sudo usermod -aG sudo yourusername
```

### 1.3 SSH 安全強化

```bash
# 編輯 SSH 配置
sudo nano /etc/ssh/sshd_config
```

**建議設定：**

```
# 禁用 root 登入
PermitRootLogin no

# 禁用密碼認證（使用金鑰）
PasswordAuthentication no

# 只允許特定用戶
AllowUsers yourusername

# 更改預設端口（可選）
Port 2222

# 登入嘗試限制
MaxAuthTries 3

# 空閒超時
ClientAliveInterval 300
ClientAliveCountMax 2
```

**設定 SSH 金鑰認證：**

```bash
# 在本機生成金鑰對
ssh-keygen -t ed25519 -C "your_email@example.com"

# 複製公鑰到節點
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@node-ip

# 重啟 SSH 服務
sudo systemctl restart sshd
```

---

## 二、防火牆配置

### 2.1 UFW 基本設定

```bash
# 安裝 UFW
sudo apt install ufw

# 預設拒絕入站
sudo ufw default deny incoming

# 預設允許出站
sudo ufw default allow outgoing

# 允許 SSH（重要！在啟用前先設定）
sudo ufw allow 22/tcp
# 或者自定義端口
sudo ufw allow 2222/tcp

# 允許比特幣 P2P 連接
sudo ufw allow 8333/tcp

# 允許 Tor（如使用）
sudo ufw allow 9050/tcp

# 啟用防火牆
sudo ufw enable

# 查看狀態
sudo ufw status verbose
```

### 2.2 進階防火牆規則

```bash
# 限制特定 IP 範圍的連接
sudo ufw allow from 192.168.1.0/24 to any port 22

# 限制 RPC 只能本機訪問
# （預設 bitcoin.conf 已設定 rpcbind=127.0.0.1）

# 限制連接速率（防止 DDoS）
sudo ufw limit 8333/tcp
```

### 2.3 iptables 進階規則（可選）

```bash
# 限制每 IP 的連接數
sudo iptables -A INPUT -p tcp --dport 8333 -m connlimit --connlimit-above 10 -j REJECT

# 限制新連接速率
sudo iptables -A INPUT -p tcp --dport 8333 -m state --state NEW -m limit --limit 10/minute --limit-burst 20 -j ACCEPT

# 保存規則
sudo apt install iptables-persistent
sudo netfilter-persistent save
```

---

## 三、Tor 整合

### 3.1 為什麼使用 Tor？

```
Tor 提供的保護：

1. IP 隱私
   └── 其他節點不知道你的真實 IP

2. 審查規避
   └── ISP 無法看到你在運行比特幣節點

3. 匿名接收
   └── 可以接受入站連接而不暴露位置

4. Sybil 攻擊防護
   └── 更難被惡意節點包圍
```

### 3.2 基本 Tor 設定

```bash
# 安裝 Tor
sudo apt install tor

# 編輯 Tor 配置
sudo nano /etc/tor/torrc

# 添加以下內容：
ControlPort 9051
CookieAuthentication 1
CookieAuthFileGroupReadable 1

# 將 bitcoin 用戶加入 tor 群組
sudo usermod -a -G debian-tor bitcoin

# 重啟 Tor
sudo systemctl restart tor
sudo systemctl enable tor
```

### 3.3 配置 Bitcoin Core 使用 Tor

**bitcoin.conf 設定：**

```ini
# 通過 Tor 代理連接
proxy=127.0.0.1:9050

# 啟用洋蔥服務（允許入站連接）
listenonion=1

# 只通過 Tor 連接（最高隱私）
onlynet=onion

# 或同時使用 clearnet 和 Tor
# 不要設定 onlynet，註解掉
# onlynet=onion
```

### 3.4 Tor 隱藏服務設定

```bash
# 編輯 Tor 配置
sudo nano /etc/tor/torrc

# 添加隱藏服務：
HiddenServiceDir /var/lib/tor/bitcoin-service/
HiddenServicePort 8333 127.0.0.1:8333

# 重啟 Tor
sudo systemctl restart tor

# 獲取你的 .onion 地址
sudo cat /var/lib/tor/bitcoin-service/hostname
# 輸出類似：abc123...xyz.onion
```

### 3.5 驗證 Tor 連接

```bash
# 檢查 Tor 連接
bitcoin-cli getnetworkinfo | grep -A 10 '"networks"'

# 應該看到：
# "onion": {
#   "reachable": true,
#   ...
# }

# 查看連接的節點類型
bitcoin-cli getpeerinfo | grep "addr"

# .onion 結尾的就是 Tor 連接
```

---

## 四、備份策略

### 4.1 需要備份什麼？

```
重要性排序：

必要備份（丟失 = 無法恢復）：
├── wallet.dat - 錢包文件（如使用內建錢包）
└── 私鑰/種子詞 - 最重要！

建議備份（丟失 = 需要重新配置）：
├── bitcoin.conf - 配置文件
├── peers.dat - 已知節點列表
└── banlist.dat - 封禁列表

不需要備份（可重新下載）：
├── blocks/ - 區塊數據
├── chainstate/ - UTXO 數據庫
└── indexes/ - 索引數據
```

### 4.2 錢包備份

```bash
# 方法 1：使用 bitcoin-cli
bitcoin-cli backupwallet /path/to/backup/wallet.dat.backup

# 方法 2：直接複製（需要停止節點）
sudo systemctl stop bitcoind
cp ~/.bitcoin/wallets/*/wallet.dat /path/to/backup/
sudo systemctl start bitcoind

# 方法 3：導出私鑰/描述符
bitcoin-cli listdescriptors true > descriptors_backup.json
```

### 4.3 配置備份腳本

```bash
#!/bin/bash
# 儲存為 /home/bitcoin/backup-node.sh

BACKUP_DIR="/mnt/backup/bitcoin-node"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/$DATE"

mkdir -p "$BACKUP_PATH"

# 備份配置文件
cp ~/.bitcoin/bitcoin.conf "$BACKUP_PATH/"

# 備份錢包（如果存在）
if [ -d ~/.bitcoin/wallets ]; then
    bitcoin-cli backupwallet "$BACKUP_PATH/wallet.dat"
fi

# 備份 peers.dat
cp ~/.bitcoin/peers.dat "$BACKUP_PATH/" 2>/dev/null

# 壓縮
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$BACKUP_PATH" .
rm -rf "$BACKUP_PATH"

# 保留最近 7 個備份
ls -t "$BACKUP_DIR"/backup_*.tar.gz | tail -n +8 | xargs rm -f

echo "備份完成: $BACKUP_DIR/backup_$DATE.tar.gz"
```

### 4.4 自動備份排程

```bash
# 編輯 crontab
crontab -e

# 每天凌晨 3 點執行備份
0 3 * * * /home/bitcoin/backup-node.sh >> /var/log/bitcoin-backup.log 2>&1
```

### 4.5 備份驗證

```bash
# 定期測試備份恢復
tar -tzf backup_YYYYMMDD.tar.gz  # 列出內容
tar -xzf backup_YYYYMMDD.tar.gz -C /tmp/test-restore/  # 測試解壓
```

---

## 五、日常維護

### 5.1 監控腳本

```bash
#!/bin/bash
# 儲存為 /home/bitcoin/node-status.sh

echo "=== Bitcoin Node 狀態報告 ==="
echo "時間: $(date)"
echo ""

# 節點運行狀態
if systemctl is-active --quiet bitcoind; then
    echo "服務狀態: 運行中 ✓"
else
    echo "服務狀態: 已停止 ✗"
    exit 1
fi

# 區塊鏈同步狀態
INFO=$(bitcoin-cli getblockchaininfo 2>/dev/null)
if [ $? -eq 0 ]; then
    BLOCKS=$(echo $INFO | jq -r '.blocks')
    HEADERS=$(echo $INFO | jq -r '.headers')
    PROGRESS=$(echo $INFO | jq -r '.verificationprogress * 100' | xargs printf "%.4f")
    SIZE=$(echo $INFO | jq -r '.size_on_disk / 1073741824' | xargs printf "%.2f")

    echo "區塊高度: $BLOCKS / $HEADERS"
    echo "同步進度: $PROGRESS%"
    echo "磁碟使用: ${SIZE} GB"
fi

# 連接狀態
PEERS=$(bitcoin-cli getconnectioncount 2>/dev/null)
echo "連接節點: $PEERS"

# 記憶體池
MEMPOOL=$(bitcoin-cli getmempoolinfo 2>/dev/null)
if [ $? -eq 0 ]; then
    TX_COUNT=$(echo $MEMPOOL | jq -r '.size')
    MEMPOOL_SIZE=$(echo $MEMPOOL | jq -r '.bytes / 1048576' | xargs printf "%.2f")
    echo "記憶體池: $TX_COUNT 筆交易 (${MEMPOOL_SIZE} MB)"
fi

# 系統資源
echo ""
echo "=== 系統資源 ==="
echo "CPU 負載: $(uptime | awk -F'load average:' '{print $2}')"
echo "記憶體: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "磁碟: $(df -h /mnt/bitcoin | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')"

# Tor 狀態
if systemctl is-active --quiet tor; then
    echo "Tor 狀態: 運行中 ✓"
else
    echo "Tor 狀態: 已停止 ✗"
fi

echo ""
```

### 5.2 日誌輪替

```bash
# 建立 logrotate 配置
sudo nano /etc/logrotate.d/bitcoind
```

```
/mnt/bitcoin/bitcoind/debug.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 bitcoin bitcoin
    postrotate
        killall -HUP bitcoind 2>/dev/null || true
    endscript
}
```

### 5.3 軟體更新程序

**更新 Bitcoin Core：**

```bash
# 1. 下載新版本
cd ~/bitcoin-core
VERSION=27.1
wget https://bitcoincore.org/bin/bitcoin-core-${VERSION}/bitcoin-${VERSION}-x86_64-linux-gnu.tar.gz
wget https://bitcoincore.org/bin/bitcoin-core-${VERSION}/SHA256SUMS
wget https://bitcoincore.org/bin/bitcoin-core-${VERSION}/SHA256SUMS.asc

# 2. 驗證
sha256sum --ignore-missing --check SHA256SUMS
gpg --verify SHA256SUMS.asc SHA256SUMS

# 3. 停止服務
sudo systemctl stop bitcoind

# 4. 備份舊版本
sudo mv /usr/local/bin/bitcoin* /tmp/bitcoin-backup/

# 5. 安裝新版本
tar -xzf bitcoin-${VERSION}-*.tar.gz
sudo install -m 0755 -o root -g root -t /usr/local/bin bitcoin-${VERSION}/bin/*

# 6. 重啟服務
sudo systemctl start bitcoind

# 7. 驗證版本
bitcoin-cli --version
```

### 5.4 健康檢查清單

**每日檢查：**

```
[ ] 節點是否在運行？
[ ] 同步是否正常？（不應該落後太多）
[ ] 磁碟空間是否充足？（>20% 可用）
[ ] 連接數是否正常？（8-40 個）
```

**每週檢查：**

```
[ ] 系統更新是否有安全補丁？
[ ] 日誌是否有異常錯誤？
[ ] 備份是否正常執行？
[ ] Tor 連接是否正常？
```

**每月檢查：**

```
[ ] Bitcoin Core 是否有新版本？
[ ] 測試備份恢復
[ ] 檢查防火牆規則
[ ] 審查 SSH 登入記錄
```

---

## 六、監控和警報

### 6.1 設定 Email 警報

```bash
# 安裝 mailutils
sudo apt install mailutils ssmtp

# 配置 SMTP（以 Gmail 為例）
sudo nano /etc/ssmtp/ssmtp.conf
```

```
root=your-email@gmail.com
mailhub=smtp.gmail.com:587
AuthUser=your-email@gmail.com
AuthPass=your-app-password
UseTLS=YES
UseSTARTTLS=YES
```

**警報腳本：**

```bash
#!/bin/bash
# 儲存為 /home/bitcoin/alert-check.sh

EMAIL="your-email@example.com"

# 檢查節點是否運行
if ! systemctl is-active --quiet bitcoind; then
    echo "Bitcoin 節點已停止！" | mail -s "⚠️ Bitcoin 節點警報" $EMAIL
fi

# 檢查同步狀態
BLOCKS=$(bitcoin-cli getblockcount 2>/dev/null)
HEADERS=$(bitcoin-cli getblockchaininfo 2>/dev/null | jq -r '.headers')

if [ ! -z "$BLOCKS" ] && [ ! -z "$HEADERS" ]; then
    BEHIND=$((HEADERS - BLOCKS))
    if [ $BEHIND -gt 10 ]; then
        echo "節點落後 $BEHIND 個區塊！" | mail -s "⚠️ Bitcoin 同步警報" $EMAIL
    fi
fi

# 檢查磁碟空間
USAGE=$(df /mnt/bitcoin | awk 'NR==2 {print $5}' | tr -d '%')
if [ $USAGE -gt 85 ]; then
    echo "磁碟使用率: $USAGE%！" | mail -s "⚠️ Bitcoin 磁碟警報" $EMAIL
fi
```

```bash
# 添加到 crontab
crontab -e

# 每 15 分鐘檢查一次
*/15 * * * * /home/bitcoin/alert-check.sh
```

### 6.2 Prometheus + Grafana（進階）

```bash
# 這是進階監控方案，需要更多設定
# 可以使用 bitcoin-prometheus-exporter

# 基本概念：
# Bitcoin Core → Exporter → Prometheus → Grafana
```

---

## 七、安全事件響應

### 7.1 如果懷疑被入侵

```bash
# 1. 立即斷開網路（如果嚴重）
sudo ifconfig eth0 down

# 2. 檢查異常登入
last -20
grep "Failed password" /var/log/auth.log

# 3. 檢查異常進程
ps aux | grep -v "^\[" | head -20
netstat -tulpn

# 4. 檢查異常文件修改
find /home -mtime -1 -type f
find /etc -mtime -1 -type f

# 5. 檢查 crontab
crontab -l
sudo crontab -l
cat /etc/crontab

# 6. 如果錢包在節點上，立即轉移資金到安全地址
```

### 7.2 錢包安全最佳實踐

```
建議：

1. 不要在節點上存放大量資金
   └── 節點主要用於驗證，不是儲存

2. 使用硬體錢包
   └── Coldcard, Trezor, Ledger

3. 如果必須使用內建錢包
   ├── 啟用錢包加密
   ├── 定期備份
   └── 考慮使用描述符錢包

4. 多重簽名
   └── 重要資金使用多簽
```

**加密錢包：**

```bash
# 加密錢包
bitcoin-cli encryptwallet "your-strong-passphrase"

# 解鎖錢包（需要時）
bitcoin-cli walletpassphrase "your-passphrase" 60

# 鎖定錢包
bitcoin-cli walletlock
```

---

## 八、常見安全問題 Q&A

### Q1：運行全節點會被追蹤嗎？

```
不使用 Tor：
- 其他節點知道你的 IP
- ISP 可以看到比特幣流量
- 但不知道具體交易內容

使用 Tor：
- 高度匿名
- ISP 只看到 Tor 流量
- 推薦使用
```

### Q2：節點被攻擊怎麼辦？

```
攻擊類型和防護：

1. DDoS 攻擊
   └── 防護：防火牆限制連接數、使用 Tor

2. Eclipse 攻擊（被惡意節點包圍）
   └── 防護：使用多個出站連接、添加可信節點

3. 系統入侵
   └── 防護：SSH 金鑰認證、系統更新、防火牆
```

### Q3：需要定期更換 Tor 地址嗎？

```
通常不需要。
.onion 地址可以長期使用。
如果有隱私顧慮，可以刪除 HiddenServiceDir 目錄並重啟 Tor。
```

---

## 下一步

恭喜！你的節點現在已經有了基本的安全防護。在本系列的最後一篇文章中，我們將探討：

- 閃電網路整合
- 區塊瀏覽器（mempool）
- Electrum 伺服器
- BTCPay Server
- 其他應用整合

---

## 參考資料

- [Bitcoin Core 安全建議](https://bitcoin.org/en/bitcoin-core/features/security)
- [Tor Project 文檔](https://www.torproject.org/docs/documentation.html)
- [UFW 防火牆指南](https://help.ubuntu.com/community/UFW)
- [SSH 安全最佳實踐](https://www.ssh.com/academy/ssh/security)
