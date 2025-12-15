# frozen_string_literal: true

source "https://rubygems.org"

# Jekyll 4.x
gem "jekyll", "~> 4.3"

# Jekyll plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-paginate", "~> 1.1"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "kramdown-parser-gfm", "~> 1.1"
end

# Performance
gem "webrick", "~> 1.8"  # Required for Ruby 3.0+

# Windows specific
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]
