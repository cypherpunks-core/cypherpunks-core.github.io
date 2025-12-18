# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "cypherpunks-theme"
  spec.version       = "2.0.0"
  spec.authors       = ["Cypherpunks Taiwan"]
  spec.email         = ["01360086@me.mcu.edu.tw"]

  spec.summary       = "Cypherpunk-style theme for Jekyll"
  spec.homepage      = "https://github.com/cypherpunks-core/cypherpunks-core.github.io"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_layouts|_includes|_sass|_posts|blog|LICENSE|README|favicon.png)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.3"
  spec.add_runtime_dependency "jekyll-feed", "~> 0.17"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.4"
  spec.add_runtime_dependency "jekyll-paginate", "~> 1.1"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.8"
  spec.add_runtime_dependency "kramdown-parser-gfm", "~> 1.1"

  spec.add_development_dependency "bundler", "~> 2.4"
end
