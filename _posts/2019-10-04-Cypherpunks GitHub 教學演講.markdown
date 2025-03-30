---
layout: post
title: Cypherpunks GitHub 教學演講
date: 2019-10-04
categories:
- meetup
description: GitHub 可以說是現今時代中工程師的一種社交網路, 當你發現原始作者有一些感興趣的專案時，你想為此專案作貢獻，加入原作者專案 Contributor
  的行列時。就可以參考本文件一步一步操作。
image: /img/75.png
published: true
hero_image: /img/hero.png
tags:
- cypherpunks
---

GitHub 可以說是現今時代中工程師的一種社交網路, 當你發現原始作者有一些感興趣的專案時，你想為此專案作貢獻，加入原作者專案 Contributor 的行列時。就可以參考本文件一步一步操作。

* *目錄：**
- [第一章、概念介紹](#%e7%ac%ac%e4%b8%80%e7%ab%a0%e6%a6%82%e5%bf%b5%e4%bb%8b%e7%b4%b9)
    - [1. 教學適用情境](#1-%e6%95%99%e5%ad%b8%e9%81%a9%e7%94%a8%e6%83%85%e5%a2%83)
    - [2. 三個角色介紹](#2-%e4%b8%89%e5%80%8b%e8%a7%92%e8%89%b2%e4%bb%8b%e7%b4%b9)
    - [3. 了解角色運作](#3-%e4%ba%86%e8%a7%a3%e8%a7%92%e8%89%b2%e9%81%8b%e4%bd%9c)
    - [4. 七步成貢獻者](#4-%e4%b8%83%e6%ad%a5%e6%88%90%e8%b2%a2%e7%8d%bb%e8%80%85)
- [第二章、完整操作](#%e7%ac%ac%e4%ba%8c%e7%ab%a0%e5%ae%8c%e6%95%b4%e6%93%8d%e4%bd%9c)
    - [(1) 請註冊 GitHub](#1-%e8%ab%8b%e8%a8%bb%e5%86%8a-github)
    - [(2) 在 GitHub 上把別人的專案弄一份到自己上面 by fork](#2-%e5%9c%a8-github-%e4%b8%8a%e6%8a%8a%e5%88%a5%e4%ba%ba%e7%9a%84%e5%b0%88%e6%a1%88%e5%bc%84%e4%b8%80%e4%bb%bd%e5%88%b0%e8%87%aa%e5%b7%b1%e4%b8%8a%e9%9d%a2-by-fork)
    - [(3)自己從自己的 repo 同步一份到電腦  ... by git clone](#3%e8%87%aa%e5%b7%b1%e5%be%9e%e8%87%aa%e5%b7%b1%e7%9a%84-repo-%e5%90%8c%e6%ad%a5%e4%b8%80%e4%bb%bd%e5%88%b0%e9%9b%bb%e8%85%a6--by-git-clone)
    - [(4)  由於別人的專案會持續更新，所以我們讓自己的 repo origin 與遠端 upstream 保持同步](#4-%e7%94%b1%e6%96%bc%e5%88%a5%e4%ba%ba%e7%9a%84%e5%b0%88%e6%a1%88%e6%9c%83%e6%8c%81%e7%ba%8c%e6%9b%b4%e6%96%b0%e6%89%80%e4%bb%a5%e6%88%91%e5%80%91%e8%ae%93%e8%87%aa%e5%b7%b1%e7%9a%84-repo-origin-%e8%88%87%e9%81%a0%e7%ab%af-upstream-%e4%bf%9d%e6%8c%81%e5%90%8c%e6%ad%a5)
      - [4.1 從 upstream 拉下來，使電腦端有遠方 upstream 的 repo](#41-%e5%be%9e-upstream-%e6%8b%89%e4%b8%8b%e4%be%86%e4%bd%bf%e9%9b%bb%e8%85%a6%e7%ab%af%e6%9c%89%e9%81%a0%e6%96%b9-upstream-%e7%9a%84-repo)
      - [4.2 透過 push 的方式更新至 origin (自己的 repo) ... 此時 upstream 便與 origin 同步](#42-%e9%80%8f%e9%81%8e-push-%e7%9a%84%e6%96%b9%e5%bc%8f%e6%9b%b4%e6%96%b0%e8%87%b3-origin-%e8%87%aa%e5%b7%b1%e7%9a%84-repo--%e6%ad%a4%e6%99%82-upstream-%e4%be%bf%e8%88%87-origin-%e5%90%8c%e6%ad%a5)
    - [(5)　開始更新並 push 至自己的 origin  (by branch 方式)](#5-%e9%96%8b%e5%a7%8b%e6%9b%b4%e6%96%b0%e4%b8%a6-push-%e8%87%b3%e8%87%aa%e5%b7%b1%e7%9a%84-origin-by-branch-%e6%96%b9%e5%bc%8f)
      - [5.1 請先確保自己已經完成上面同步同作](#51-%e8%ab%8b%e5%85%88%e7%a2%ba%e4%bf%9d%e8%87%aa%e5%b7%b1%e5%b7%b2%e7%b6%93%e5%ae%8c%e6%88%90%e4%b8%8a%e9%9d%a2%e5%90%8c%e6%ad%a5%e5%90%8c%e4%bd%9c)
      - [5.2 新增一個 branch](#52-%e6%96%b0%e5%a2%9e%e4%b8%80%e5%80%8b-branch)
      - [5.3 在此 branch 上面作新增與修改，然後 git add ,  git commit 最後 push 至自己的](#53-%e5%9c%a8%e6%ad%a4-branch-%e4%b8%8a%e9%9d%a2%e4%bd%9c%e6%96%b0%e5%a2%9e%e8%88%87%e4%bf%ae%e6%94%b9%e7%84%b6%e5%be%8c-git-add--git-commit-%e6%9c%80%e5%be%8c-push-%e8%87%b3%e8%87%aa%e5%b7%b1%e7%9a%84)
    - [(6) 到GitHub 上進行 Pull Request。原作者同意後便會 merge 進來](#6-%e5%88%b0github-%e4%b8%8a%e9%80%b2%e8%a1%8c-pull-request%e5%8e%9f%e4%bd%9c%e8%80%85%e5%90%8c%e6%84%8f%e5%be%8c%e4%be%bf%e6%9c%83-merge-%e9%80%b2%e4%be%86)
    - [(7) 原作者會將你提的請求　，merge 之後，記得順便作一整個同步的動作](#7-%e5%8e%9f%e4%bd%9c%e8%80%85%e6%9c%83%e5%b0%87%e4%bd%a0%e6%8f%90%e7%9a%84%e8%ab%8b%e6%b1%82-merge-%e4%b9%8b%e5%be%8c%e8%a8%98%e5%be%97%e9%a0%86%e4%be%bf%e4%bd%9c%e4%b8%80%e6%95%b4%e5%80%8b%e5%90%8c%e6%ad%a5%e7%9a%84%e5%8b%95%e4%bd%9c)

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

![](/img/76.png)

### (3)自己從自己的 repo 同步一份到電腦  ... by git clone 

```text
$ git clone https://github.com/funprogrammer-byte/milo-education-python
```
### (4)  由於別人的專案會持續更新，所以我們讓自己的 repo origin 與遠端 upstream 保持同步

<< 讓原作者與自己 GitHub 同步,一起同步的手法 >> 

#### 4.1 從 upstream 拉下來，使電腦端有遠方 upstream 的 repo 

```text
$ git remote add upstream https://github.com/milochen0418/milo-education-python
$ git remote -v
```
就會看到 upstream 了

```text
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
```
#### 4.2 透過 push 的方式更新至 origin (自己的 repo) ... 此時 upstream 便與 origin 同步

```text
$ git status
```
可以看到自己目前電腦端， 已經與my github account 上的 repo 有不同了

```text
$ git push -u origin master
```
### (5)　開始更新並 push 至自己的 origin  (by branch 方式)

<<開始作自己的更新 >>

#### 5.1 請先確保自己已經完成上面同步同作 

#### 5.2 新增一個 branch 

```text
$ git branch -a ← 查詢 branch 狀況，包含 電腦外的 branch
```
接著就開始新建

```text
$ git branch pr-test-0001 
$ git checkout pr-test-0001
```
改一些程式

#### 5.3 在此 branch 上面作新增與修改，然後 git add ,  git commit 最後 push 至自己的

修改一些東西後

![](/img/77.png)

```text
$ git add .
$ git commit -m "This is commit test"
$ git push -u origin pr-test-0001
```
這時候你可以從自己的 GitHub 上面看到類似這訊息

![](/img/78.png)![](/img/79.png)

### (6) 到GitHub 上進行 Pull Request。原作者同意後便會 merge 進來

View of Owner can see Pull Request

![](/img/80.png)![](/img/81.png)![](/img/82.png)

### (7) 原作者會將你提的請求　，merge 之後，記得順便作一整個同步的動作

Go to the section  → << 讓原作者與自己 GitHbu 同步,一起同步的手法 >> 

有時,你會忘了開branch，但 卻已經 push 到 origin master 的話，補救辦法如下 
[link](https://stackoverflow.com/questions/17667023/git-how-to-reset-origin-master-to-a-commit)
