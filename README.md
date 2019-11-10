**路徑簡介：**

```
    |_ /_post: blog 文章位置
    |_ /_site : 編譯過的網站位置  # 不建議更動
    |_ /_product : 書架上的書
    |_ /img: blog 圖片位置
    |_ /markdown__
    |            |_ knowledge : 存放知識庫文章
    |            |_ resource : 存放資源文章
    |            |_ about.md : 關於我們的頁面
    |            |_ product.md : 書架頁面
    |            |_ satellit.md : 衛星計畫頁面		   
    |_ _data __    
    |         |__ navigation : 定義 網站最上層的分頁 相依/markdown    
    |_ _layouts : 網頁框架定義   # 不建議更動   
    |_ readme.md : 本文件位置    
    |_ index.md cypherpunks-core.github.io 首頁內容
```

**文章貢獻注意事項：**
* 在`/_post`創建新的markdonwn文件，請依照發布 `年-月-日-標題.markdown`格式命名
* `年-月-日-標題.markdown` 文件最上部的`YAML`請參考下方進行修改
	> * `image: '/img/125.png'` 圖片請放置在此處`/img/`，圖片命名格式`作者名-流水號.png`，圖片寬度為800
	> * 如果還不想發布可以把`published: true`改為`false`
	> **注意：**`layout: post`, `categories: news`, `hero_image: /img/hero.png`建議不要更動
	```
	---
	layout: post
	title:  "文章標題"
	date:   2019-11-10
	categories: news
	description: "文章摘要"
	image: '/img/125.png'
	published: true
	hero_image: /img/hero.png
	---
	```
* 圖片，請放置在`/img`中，因用圖片請用`/img.png`格式（請勿用託管圖片，怕圖片失效

	> 圖片大小規範：
	> * blog 圖片 寬度 800 x 600  # 寬度一定要800 高度隨意
	> * 商品  圖片 寬度 640 x 480


# 本地運行
## 前置要求
- [bundler](https://bundler.io/#getting-started)
```
    $ gem install bundler
```

## 下載專案
```
    $ git clone https://github.com/cypherpunks-core/cypherpunks-core.github.io.git
```

## 初始化
```
    $ bundle install
```

## 本地運行
```
    $ bundle exec jekyll server --future
```
若執行成功，下方將顯示運行中的 _Server address_ ，預設為 _Server address_: `http://127.0.0.1:4000`。


---


