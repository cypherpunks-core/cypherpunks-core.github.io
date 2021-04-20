## 路徑簡介：

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
    |_ index.md : cypherpunks-core.github.io 首頁內容
    |_ classification.md : 文章分類分頁內容
```

## 文章貢獻注意事項：
* **文件命名：** 在`/_post`創建新的markdonwn文件，請依照發布 `年-月-日-標題.markdown`格式命名
* **YAML設定：** `年-月-日-標題.markdown` 文件最上部的`YAML`請參考下方進行修改
	> * `image: '/img/125.png'` 圖片請放置在此處`/img/`，圖片命名格式`作者名-流水號.png`，圖片寬度為800
	> * 如果還不想發布可以把`published: true`改為`false`。  
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

* **圖片位置：** 圖片，請放置在`/img`中，因用圖片請用`/img.png`格式（請勿用託管圖片，怕圖片失效

	> 圖片大小規範：
	> * blog 圖片 寬度 800 x 600  # 寬度一定要800 高度隨意
	> * 商品  圖片 寬度 640 x 480
* **數學公式：** 可以markdown的文件當中添加以下程式碼([參考](https://www.jianshu.com/p/054484d0892a)第四項)：
  ```
  <script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=default"></script>
  ```
  使用方法：`$$公式$$`
  > 因為markdown 第一行通常為預覽頁面的摘要，建議放在第一句話的後面，預防出現問題

## 搭建測試環境
**Ruby 環境要求**
要降到2.7.* 不然無法執行

**Mac OS X :**
```
# 在 terminal  輸入 安裝  xcode-select
xcode-select --install

# 安裝 homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# 安裝 ruby
brew install ruby

# 設定環境
export PATH=/usr/local/opt/ruby/bin:$PATH

# 安裝 jekyll bundler
gem install jekyll bundler

# 下載專案
git clone https://github.com/cypherpunks-core/cypherpunks-core.github.io.git

# 進入專案
cd cypherpunks-core.github.io.git

# 安裝 該專案所需套件
bundle install

# 在本地端起一個 server 
bundle exec jekyll server --future
```

若執行成功，下方將顯示運行中的 _Server address_ ，預設為 _Server address_: [http://127.0.0.1:4000](http://127.0.0.1:4000)。