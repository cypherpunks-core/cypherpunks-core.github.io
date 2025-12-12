---
layout: post
title: '從零開始的比特幣全節點（二）：硬體選擇與環境準備'
date: 2025-03-02
categories:
- bitcoin
- tutorial
description: 比特幣全節點教程系列第二篇，詳細介紹硬體選擇、儲存設備比較、作業系統準備，以及網路環境配置。
image: /img/full-node.svg
published: true
hero_image: /img/hero.png
series: bitcoin-full-node
tags:
- bitcoin
- full-node
- tutorial
- hardware
- raspberry-pi
---

## 系列導言

這是「從零開始的比特幣全節點」系列教程的第二篇。本篇將詳細介紹如何選擇合適的硬體，並準備好運行環境。

**系列文章：**
1. [為什麼要運行全節點？](/bitcoin/tutorial/2025/03/01/bitcoin-full-node-series-1-why-run-node/)
2. **硬體選擇與環境準備**（本篇）
3. Bitcoin Core 安裝與配置
4. 節點安全與日常維護
5. 進階功能與生態整合

---

## 一、硬體需求概覽

### 最低需求 vs 建議配置

| 組件 | 最低需求 | 建議配置 | 理想配置 |
|------|---------|---------|---------|
| **CPU** | 雙核 1.5GHz | 四核 2GHz+ | 六核+ |
| **RAM** | 2GB | 4-8GB | 16GB+ |
| **儲存** | 10GB (修剪) | 1TB SSD | 2TB NVMe |
| **網路** | 1 Mbps | 10 Mbps+ | 100 Mbps+ |

### 不同配置的使用體驗

```
最低配置（修剪模式）：
├── 初始同步：7-14 天
├── 日常使用：可接受
├── 閃電網路：不支援
└── 成本：~$100

建議配置：
├── 初始同步：2-5 天
├── 日常使用：良好
├── 閃電網路：支援
└── 成本：~$300

理想配置：
├── 初始同步：6-24 小時
├── 日常使用：優秀
├── 閃電網路：最佳體驗
└── 成本：~$500+
```

---

## 二、硬體選項比較

### 選項 1：Raspberry Pi

```
┌─────────────────────────────────────┐
│         Raspberry Pi 4/5            │
├─────────────────────────────────────┤
│ 優點：                              │
│ ✓ 低功耗（5-15W）                   │
│ ✓ 體積小巧                          │
│ ✓ 社區支援豐富                      │
│ ✓ 成本較低                          │
│                                     │
│ 缺點：                              │
│ ✗ 初始同步較慢                      │
│ ✗ 需要外接儲存                      │
│ ✗ RAM 有限                          │
│                                     │
│ 建議型號：                          │
│ • Pi 4 (4GB/8GB) - $55-75          │
│ • Pi 5 (4GB/8GB) - $60-80          │
└─────────────────────────────────────┘
```

**Raspberry Pi 完整套裝清單：**

| 項目 | 規格 | 價格估算 |
|------|------|---------|
| Raspberry Pi 4/5 | 4GB 或 8GB | $60-80 |
| 電源供應器 | 官方 5V/3A | $10-15 |
| 散熱器/風扇 | 主動或被動 | $5-15 |
| MicroSD 卡 | 32GB+ (系統用) | $10-15 |
| SSD | 1TB SATA/NVMe | $60-100 |
| SSD 外接盒 | USB 3.0 | $15-25 |
| 外殼 | 含風扇更佳 | $10-20 |
| **總計** | | **$170-270** |

### 選項 2：迷你 PC

```
┌─────────────────────────────────────┐
│           迷你 PC                    │
├─────────────────────────────────────┤
│ 優點：                              │
│ ✓ 性能較強                          │
│ ✓ 內建儲存槽                        │
│ ✓ 更多 RAM                          │
│ ✓ 同步速度快                        │
│                                     │
│ 缺點：                              │
│ ✗ 功耗較高（20-50W）                │
│ ✗ 成本較高                          │
│                                     │
│ 推薦型號：                          │
│ • Intel NUC - $300-500             │
│ • Minisforum - $200-400            │
│ • Beelink - $150-300               │
└─────────────────────────────────────┘
```

**迷你 PC 建議規格：**

| 組件 | 最低 | 建議 |
|------|------|------|
| CPU | Intel N5105 / AMD Ryzen 3 | Intel i5 / AMD Ryzen 5 |
| RAM | 8GB | 16GB |
| 儲存 | 512GB SSD | 1TB NVMe |

### 選項 3：舊電腦再利用

```
┌─────────────────────────────────────┐
│           舊電腦/筆電               │
├─────────────────────────────────────┤
│ 優點：                              │
│ ✓ 零額外硬體成本                    │
│ ✓ 可能已有足夠性能                  │
│                                     │
│ 缺點：                              │
│ ✗ 功耗可能較高                      │
│ ✗ 佔用空間                          │
│ ✗ 噪音                              │
│                                     │
│ 最低要求：                          │
│ • 2010 年後的電腦                   │
│ • 可升級加裝 SSD                    │
└─────────────────────────────────────┘
```

### 選項 4：預組裝節點

| 產品 | 特點 | 價格 |
|------|------|------|
| **Nodl One** | 即插即用 | ~$500 |
| **RaspiBlitz** | DIY 套件 | ~$300 |
| **Start9 Server** | 隱私優先 | ~$600 |
| **Umbrel Home** | 美觀易用 | ~$450 |

---

## 三、儲存設備深入比較

### SSD 類型比較

```
效能排名（從快到慢）：

1. NVMe PCIe 4.0
   └── 讀取：7000 MB/s
   └── 適合：高性能需求

2. NVMe PCIe 3.0
   └── 讀取：3500 MB/s
   └── 適合：大多數用戶（推薦）

3. SATA SSD
   └── 讀取：550 MB/s
   └── 適合：預算有限

4. HDD（不推薦）
   └── 讀取：100-200 MB/s
   └── 初始同步可能需要數週
```

### 儲存容量規劃

```
比特幣區塊鏈大小（2024年底）：
├── 區塊數據：~600 GB
├── UTXO 集：~8 GB
├── 索引（可選）：~30 GB
└── 總計：~650 GB

成長速度：
├── 每年約增加 50-80 GB
└── 1TB SSD 可用約 5-7 年

建議：
├── 最低：1TB（有擴展空間）
└── 理想：2TB（長期無憂）
```

### 推薦 SSD 型號

**NVMe SSD：**

| 型號 | 容量 | 特點 | 價格估算 |
|------|------|------|---------|
| Samsung 970 EVO Plus | 1TB | 高耐用度 | $80-100 |
| WD Black SN770 | 1TB | 性價比高 | $60-80 |
| Crucial P3 Plus | 1TB | 預算選擇 | $50-70 |

**SATA SSD（適合 Pi）：**

| 型號 | 容量 | 特點 | 價格估算 |
|------|------|------|---------|
| Samsung 870 EVO | 1TB | 可靠穩定 | $70-90 |
| Crucial MX500 | 1TB | 性價比高 | $60-80 |
| WD Blue SA510 | 1TB | 預算選擇 | $50-70 |

---

## 四、作業系統選擇

### Linux 發行版比較

| 發行版 | 特點 | 推薦程度 |
|--------|------|---------|
| **Ubuntu Server** | 文檔豐富、社區大 | ★★★★★ |
| **Debian** | 穩定、輕量 | ★★★★★ |
| **Raspberry Pi OS** | Pi 專用優化 | ★★★★☆ |
| **Ubuntu Desktop** | 有 GUI、適合入門 | ★★★☆☆ |

### 為什麼推薦 Linux？

```
Linux 優勢：
├── 資源佔用低
├── 無需授權費用
├── 安全性高
├── 社區支援好
└── Bitcoin Core 原生支援

Windows 缺點：
├── 資源佔用高
├── 更新可能中斷服務
├── 安全風險較高
└── 儲存效率較差
```

### Raspberry Pi OS 安裝

**步驟 1：下載映像**

```bash
# 使用 Raspberry Pi Imager（推薦）
# 從官網下載：https://www.raspberrypi.com/software/

# 或手動下載 64-bit Lite 版本
wget https://downloads.raspberrypi.org/raspios_lite_arm64/images/...
```

**步驟 2：寫入 SD 卡**

使用 Raspberry Pi Imager：
1. 選擇 Raspberry Pi OS Lite (64-bit)
2. 選擇目標 SD 卡
3. 點擊設定齒輪配置：
   - 設定主機名稱
   - 啟用 SSH
   - 設定用戶名和密碼
   - 配置 WiFi（可選）
4. 寫入

**步驟 3：首次啟動配置**

```bash
# SSH 連接到 Pi
ssh username@raspberrypi.local

# 更新系統
sudo apt update && sudo apt upgrade -y

# 設定時區
sudo timedatectl set-timezone Asia/Taipei

# 擴展檔案系統（如需要）
sudo raspi-config
# 選擇 Advanced Options → Expand Filesystem
```

### Ubuntu Server 安裝

**步驟 1：下載 ISO**

```bash
# 從官網下載 Ubuntu Server 22.04 LTS
# https://ubuntu.com/download/server
```

**步驟 2：建立安裝媒體**

使用 Rufus (Windows) 或 dd (Linux/Mac) 寫入 USB

**步驟 3：安裝配置**

安裝過程中：
- 選擇最小安裝
- 配置網路
- 建立用戶帳號
- 啟用 OpenSSH Server
- 不選擇額外 snap 套件

---

## 五、儲存設備配置

### 掛載外接 SSD（Raspberry Pi）

**步驟 1：識別設備**

```bash
# 查看已連接的儲存設備
lsblk

# 輸出範例：
# sda           8:0    0 931.5G  0 disk
# └─sda1        8:1    0 931.5G  0 part
```

**步驟 2：格式化（如需要）**

```bash
# 格式化為 ext4
sudo mkfs.ext4 /dev/sda1

# 如果是新硬碟，先建立分區
sudo fdisk /dev/sda
# n → p → 1 → Enter → Enter → w
```

**步驟 3：建立掛載點**

```bash
# 建立比特幣數據目錄
sudo mkdir -p /mnt/bitcoin

# 設定擁有者
sudo chown $USER:$USER /mnt/bitcoin
```

**步驟 4：配置自動掛載**

```bash
# 獲取 UUID
sudo blkid /dev/sda1
# 輸出：/dev/sda1: UUID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" TYPE="ext4"

# 編輯 fstab
sudo nano /etc/fstab

# 添加行：
UUID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx /mnt/bitcoin ext4 defaults,noatime 0 2

# 測試掛載
sudo mount -a

# 驗證
df -h /mnt/bitcoin
```

### NVMe SSD 配置（迷你 PC）

```bash
# 通常內建 NVMe 會自動掛載
# 如需額外配置，步驟類似上述

# 建議建立專用分區給比特幣數據
sudo fdisk /dev/nvme0n1
# 根據需要分區

# 格式化
sudo mkfs.ext4 /dev/nvme0n1p2

# 掛載配置同上
```

---

## 六、網路環境配置

### 基本網路需求

```
頻寬需求：
├── 初始同步：越快越好（建議 10Mbps+）
├── 日常運行：~200 MB/天（約 6 GB/月）
└── 作為公開節點：可達 200 GB/月

連接埠：
├── 8333 (mainnet)
├── 18333 (testnet)
└── 38333 (signet)
```

### 固定 IP 配置

**使用 netplan（Ubuntu）：**

```bash
# 編輯配置
sudo nano /etc/netplan/01-netcfg.yaml
```

```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```

```bash
# 應用配置
sudo netplan apply
```

**使用 dhcpcd（Raspberry Pi OS）：**

```bash
# 編輯配置
sudo nano /etc/dhcpcd.conf

# 添加：
interface eth0
static ip_address=192.168.1.100/24
static routers=192.168.1.1
static domain_name_servers=8.8.8.8 8.8.4.4
```

### 路由器配置（可選）

如果想讓節點接受外部連接：

```
1. 登入路由器管理頁面
2. 找到「連接埠轉發」或「Port Forwarding」
3. 新增規則：
   - 外部埠：8333
   - 內部 IP：節點的 IP
   - 內部埠：8333
   - 協議：TCP
4. 儲存並應用
```

### Tor 配置（推薦）

```bash
# 安裝 Tor
sudo apt install tor

# 編輯 Tor 配置
sudo nano /etc/tor/torrc

# 添加：
ControlPort 9051
CookieAuthentication 1
CookieAuthFileGroupReadable 1

# 重啟 Tor
sudo systemctl restart tor
sudo systemctl enable tor
```

---

## 七、系統優化

### 記憶體優化

```bash
# 減少 swap 使用傾向
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

# 配置 swap（如記憶體不足）
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 檔案系統優化

```bash
# 對於 SSD，確保 TRIM 啟用
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer

# 調整檔案描述符限制
echo '* soft nofile 65535' | sudo tee -a /etc/security/limits.conf
echo '* hard nofile 65535' | sudo tee -a /etc/security/limits.conf
```

### Raspberry Pi 特定優化

```bash
# 編輯 config.txt
sudo nano /boot/config.txt

# 添加 USB 優化（Pi 4）：
dtoverlay=usb-dwc2,dr_mode=host

# 如果不用桌面，減少 GPU 記憶體：
gpu_mem=16

# 重啟生效
sudo reboot
```

---

## 八、環境驗證清單

在進入下一步安裝 Bitcoin Core 之前，確認以下項目：

```
硬體準備
[ ] 計算設備已就位並正常運作
[ ] SSD 已連接並可被識別
[ ] 散熱充足（溫度穩定）

作業系統
[ ] Linux 系統已安裝
[ ] 系統已更新到最新版本
[ ] SSH 已啟用並可連接

儲存
[ ] SSD 已格式化為 ext4
[ ] 掛載點已建立（/mnt/bitcoin 或其他）
[ ] 已配置開機自動掛載
[ ] 空間足夠（>= 700GB 或修剪模式 >= 10GB）

網路
[ ] 網路連接穩定
[ ] 固定 IP 已配置（推薦）
[ ] Tor 已安裝（推薦）

系統優化
[ ] swap 已配置（如需要）
[ ] 檔案描述符限制已調整
```

---

## 下一步

在本系列的下一篇文章中，我們將：

- 下載並驗證 Bitcoin Core
- 配置 bitcoin.conf
- 啟動初始區塊同步
- 設定自動啟動服務

---

## 參考資料

- [Raspberry Pi 官方文檔](https://www.raspberrypi.com/documentation/)
- [Ubuntu Server 安裝指南](https://ubuntu.com/server/docs)
- [Bitcoin Core 硬體需求](https://bitcoin.org/en/bitcoin-core/features/requirements)
- [RaspiBlitz 硬體指南](https://github.com/rootzoll/raspiblitz)
