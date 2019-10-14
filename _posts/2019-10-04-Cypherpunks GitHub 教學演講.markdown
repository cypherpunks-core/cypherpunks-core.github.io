---
layout: post
title:  "Cypherpunks GitHub 教學演講"
date:   2019-10-04
categories: meetup
description: "GitHub 可以說是現今時代中工程師的一種社交網路, 當你發現原始作者有一些感興趣的專案時，你想為此專案作貢獻，加入原作者專案 Contributor 的行列時。就可以參考本文件一步一步操作。"
image: '/img/75.png'
published: true
hero_image: /img/hero.png
---

GitHub 可以說是現今時代中工程師的一種社交網路, 當你發現原始作者有一些感興趣的專案時，你想為此專案作貢獻，加入原作者專案 Contributor 的行列時。就可以參考本文件一步一步操作。

# 第一章、概念介紹

### 1. 教學適用情境



> 但真實世界中，原作者不一定總接受提交，但可以多來 [Cypherpunks-core](https://github.com/cypherpunks-core) 的 GitHub 來, 我們比較開放讓大家一同來成為貢獻者。或是 [到我這](https://github.com/milochen0418/milo-education-python) 專案來，該專案裡面有個 GitHub 資料夾，在裡面你可以隨意更新，然後試著更新，然後對我發更新請求(Pull Request), 我可以幫你 merge，讓你成功使用本次的教學。若有操作上不懂之處，或是回家不懂，也可至 [Event Discussion](https://www.facebook.com/events/523580818418580/) 這邊留言討論。

### 2. 三個角色介紹

注意有 Three role 三個角色

> (1) Upstream master (原始作者之 project)
> (2) Origin master  (我 Fork 出來的 project )
> (3) And the master in my local computer (我 local 端從 自己 origin master fork 出來的 project)

### 3. 了解角色運作

知道這三者角色後，作法的概念，很簡單，如下

> 一開始先讓1,2,3 三者角色資料同步。在三方資料都同步的情況下，local computer 作一個branch , 並且在該 branch 上作commit. 接著把這個 branch push 到 Origin master 上，再由 Origin master 上會有 branch  出來，接著作 pull request. 原作者會將你提交的更新給 merge 進去。

### 4. 七步成貢獻者

至於如何實現上面概念，作法就只有 7  步, 你就有機會成為原作者專案中的 Contributor 了

> (1)請註冊GitHub [ 沒有的人請註冊 ]
> (2) 用 fork 把原始作者 GitHub 上的 project 帶到自己的 GitHub 上
> (3) 從自己 fork 出來的 project  那邊， clone 到自己電腦上
> (4) 使 origin master 與 upstream master 同步
> (5) 在 local 電腦端建立branch 並且作更新，並將該branch更新至 origin master
> (6) 在origin 上以該 branch 作 Pull Request , 並等待原始作者接受更新至 upstream/master
> (7) 原作者接受更新，將 upstrem/master 的資料與 local 電腦 master 及origin master 同步

上面這 7 步的操作，其完整作法，請見下面完整操作的章節

# 第二章、完整操作

### (1) 請註冊 GitHub 

如果有 GitHub 帳號的人就登入，沒有的話，請自行到 GitHub 註冊一個帳號

### (2) 在 GitHub 上把別人的專案弄一份到自己上面 by fork 

首次拉一個有趣的專案進來, 例如至

http://github.com/milochen0418/milo-education-python

![](https://lh4.googleusercontent.com/tlsmNdBZFQJv-H16pffyJWe1YCUd3KFZsQ-seyQIvNFtbmLMjyoTmd3Jxs9UTuQMpb8hmEwda6uRZ1z7_zLS8-X-SuM80-Ce-MADnMmcvGnRxoMWx42d04ZU10Mmo4r_DyFbX_Xj)

### (3)自己從自己的 repo 同步一份到電腦  ... by git clone 

```
$ git clone https://github.com/funprogrammer-byte/milo-education-python
```

### (4)  由於別人的專案會持續更新，所以我們讓自己的 repo origin 與遠端 upstream 保持同步

<< 讓原作者與自己 GitHub 同步,一起同步的手法 >> 

#### 4.1 從 upstream 拉下來，使電腦端有遠方 upstream 的 repo 

```
$ git remote add upstream https://github.com/milochen0418/milo-education-python
$ git remote -v
```

就會看到 upstream 了

```
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
```

#### 4.2 透過 push 的方式更新至 origin (自己的 repo) ... 此時 upstream 便與 origin 同步

```
$ git status
```

可以看到自己目前電腦端， 已經與my github account 上的 repo 有不同了

```
$ git push -u origin master
```

### (5)　開始更新並 push 至自己的 origin  (by branch 方式)

<<開始作自己的更新 >>

#### 5.1 請先確保自己已經完成上面同步同作 

#### 5.2 新增一個 branch 

```
$ git branch -a ← 查詢 branch 狀況，包含 電腦外的 branch
```

接著就開始新建

```
$ git branch pr-test-0001 
$ git checkout pr-test-0001
```

改一些程式

#### 5.3 在此 branch 上面作新增與修改，然後 git add ,  git commit 最後 push 至自己的

修改一些東西後

![](https://lh5.googleusercontent.com/o502kiSf9lJfpx5zhjaXGdUC4_-CxD0qK9GvICjB-eOMEQ80jTwyaFSd2oUKaBe9S8yOb9jmFy7r8AL8gMe8x0UoH9R2F6DeL53ZuOUA45fHGoIMaLh6KVGn71_KOvDyDP54avuZ)

```
$ git add .
$ git commit -m "This is commit test"
$ git push -u origin pr-test-0001
```

這時候你可以從自己的 GitHub 上面看到類似這訊息

![](https://lh5.googleusercontent.com/w9q7AxIBjPiKJTEqVHCIrjmaOzDaGUF-1ukYlIXolFi1-b7x1OxlnmlOzVKlZXw4rFu0kKjbf6xJ2PB84VWyB2e1w0ed86ARSEVoBu-ES4714ij_j0CSGf5eLCuar_sHWzYhIUpG)

### ![|438x337](https://lh3.googleusercontent.com/UuZ40zM6YIajJVGIsTSD2fYcnHBtkXxsIGJ4ilavFUlufOjxrjsH5Ixc2IU1_OhDh0cMX2mx1bU9KomOYCKgIAwDjuwGgZNEQvS6JumNaVzp4prEGLgbqMfPrMWoiwy8XkSO57ak)

### (6) 到GitHub 上進行 Pull Request。原作者同意後便會 merge 進來

View of Owner can see Pull Request

![](https://lh4.googleusercontent.com/UXIajh56Ws01f6WkgUsKEf3FJyBuE4HHnHXAc9J9niDZ6IYFjyBuoQeV7u2hi6O3uQ6-EMC-6u15jzv_4yekmg5LOJVhixyZCAtslcaF8VEWB24_GMTFBLtKz9BZnfi1yY8S7VOp)

![](https://lh3.googleusercontent.com/sWL0ZkRcpcgAUo8-RZLxa_VMHW6rPqmVqtIhqQYaNKqUMBAmoPLLKX3NmuG6MTLHrFLbUpVnn81Dmh4VhDpdM9fAPNyEguaaN53Oh2JzvshXHGCL_TPfpGTka7j58ZFmt5EYyXKw)![](https://lh4.googleusercontent.com/cVvpwYq4N5GgIYGAccSP2v3DYtnDRsdxcL0_kcxFgB5BJQKbuoClV5LSR94eFLBpQRsQl6ESai6iJm4oqVCJpjEmQCVRSke26im6N1N9Qx8WicEF0h7GztfHrVPq9kzjW-I_yB4r)

### (7) 原作者會將你提的請求　，merge 之後，記得順便作一整個同步的動作

Go to the section  → << 讓原作者與自己 GitHbu 同步,一起同步的手法 >> 

有時,你會忘了開branch，但 卻已經 push 到 origin master 的話，補救辦法如下 
[link](https://stackoverflow.com/questions/17667023/git-how-to-reset-origin-master-to-a-commit)