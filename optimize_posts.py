#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import yaml
import glob
from datetime import datetime

# 定義文章目錄路徑
POSTS_DIR = '_posts'

# 定義合法的分類和標籤
VALID_CATEGORIES = [
    'news', 'technology', 'privacy', 'security', 'cryptocurrency', 'blockchain', 
    'bitcoin', 'cryptography', 'community', 'tutorial', 'translation'
]

VALID_TAGS = [
    'bitcoin', 'blockchain', 'privacy', 'security', 'cryptography', 'cryptocurrency',
    'decentralization', 'technology', 'community', 'tutorial', 'translation', 
    'cypherpunks', 'eth', 'ethereum', 'lightning-network', 'development', 
    'multisig', 'schnorr', 'sidechains', 'soft-fork', 'hard-fork', 'taproot', 'cosmos',
    'zero-knowledge-proof', 'mimblewimble', 'grin', 'miniscript', 'wallet', 'bip'
]

def extract_yaml_and_content(file_path):
    """從Markdown文件中提取YAML前置資料和正文內容"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 使用正則表達式匹配YAML部分
    yaml_pattern = r'^---\s*\n(.*?)\n---\s*\n'
    yaml_match = re.search(yaml_pattern, content, re.DOTALL)
    
    if yaml_match:
        yaml_text = yaml_match.group(1)
        content_text = content[yaml_match.end():]
        try:
            yaml_data = yaml.safe_load(yaml_text)
            return yaml_data, content_text
        except yaml.YAMLError as e:
            print(f"解析YAML失敗: {file_path}, 錯誤: {e}")
            return None, content
    else:
        print(f"未找到YAML前置資料: {file_path}")
        return None, content

def optimize_yaml(yaml_data, file_name):
    """優化YAML前置資料"""
    if yaml_data is None:
        # 如果沒有YAML，創建一個基本的YAML結構
        yaml_data = {}
    
    # 提取文件名中的日期和標題
    date_match = re.match(r'(\d{4}-\d{2}-\d{2})-(.*?)\.markdown', file_name)
    if date_match:
        date_str = date_match.group(1)
        title_from_filename = date_match.group(2).replace('-', ' ')
    else:
        date_str = datetime.now().strftime('%Y-%m-%d')
        title_from_filename = file_name.replace('.markdown', '').replace('-', ' ')
    
    # 確保基本欄位存在
    if 'layout' not in yaml_data:
        yaml_data['layout'] = 'post'
    
    if 'title' not in yaml_data:
        yaml_data['title'] = title_from_filename
    
    if 'date' not in yaml_data:
        yaml_data['date'] = date_str
    
    if 'published' not in yaml_data:
        yaml_data['published'] = True
    
    if 'hero_image' not in yaml_data:
        yaml_data['hero_image'] = '/img/hero.png'
    
    # 標準化分類
    if 'categories' not in yaml_data or not yaml_data['categories']:
        yaml_data['categories'] = ['news']
    elif isinstance(yaml_data['categories'], str):
        # 將字符串分類轉換為列表
        categories = [c.strip() for c in yaml_data['categories'].split()]
        yaml_data['categories'] = categories if categories else ['news']
    
    # 標準化標籤
    if 'tags' not in yaml_data or not yaml_data['tags']:
        # 從標題和內容中猜測標籤
        title = yaml_data.get('title', '').lower()
        default_tags = []
        
        for tag in VALID_TAGS:
            if tag.lower() in title:
                default_tags.append(tag)
        
        if not default_tags:
            default_tags = ['cypherpunks']
        
        yaml_data['tags'] = default_tags
    
    # 確保description存在
    if 'description' not in yaml_data or not yaml_data['description']:
        # 取標題作為描述，如果描述為空
        yaml_data['description'] = yaml_data.get('title', '')
    
    # 確保image存在
    if 'image' not in yaml_data:
        yaml_data['image'] = '/img/default.jpg'
    
    return yaml_data

def optimize_content(content):
    """優化文章內容的排版"""
    # 標準化標題格式 (確保#後有空格)
    content = re.sub(r'(^|\n)#([^#\s])', r'\1# \2', content)
    content = re.sub(r'(^|\n)##([^#\s])', r'\1## \2', content)
    content = re.sub(r'(^|\n)###([^#\s])', r'\1### \2', content)
    content = re.sub(r'(^|\n)####([^#\s])', r'\1#### \2', content)
    
    # 標準化圖片格式
    # 修正圖片路徑格式 - 確保所有圖片路徑都以 /img/ 開頭
    content = re.sub(r'!\[(.*?)\]\((?!http)(?!/)([^/].*?)\)', r'![\1](/\2)', content)
    content = re.sub(r'!\[(.*?)\]\((?:/+)(img/.*?)\)', r'![\1](/\2)', content)
    
    # 標準化列表格式 (確保-或*後有空格)
    content = re.sub(r'(^|\n)- *([^\s])', r'\1- \2', content)
    content = re.sub(r'(^|\n)\* *([^\s])', r'\1* \2', content)
    
    # 標準化程式碼區塊
    # 找到沒有語言標記的代碼區塊並添加text標記
    content = re.sub(r'```\s*\n', r'```text\n', content)
    
    # 修復錯誤的代碼區塊結束標記（text後面出現text的情況）
    content = re.sub(r'```text\n(.*?)```text', r'```text\n\1```', content, flags=re.DOTALL)
    
    # 標準化引用格式 (確保>後有空格)
    content = re.sub(r'(^|\n)>([^\s])', r'\1> \2', content)
    
    # 標準化段落間距 (確保段落之間有一個空行)
    content = re.sub(r'\n{3,}', r'\n\n', content)
    
    return content

def save_markdown(file_path, yaml_data, content):
    """儲存優化後的Markdown文件"""
    # 將YAML轉換為字符串
    yaml_str = yaml.dump(yaml_data, allow_unicode=True, default_flow_style=False, sort_keys=False)
    
    # 組合新的Markdown內容
    new_content = f"---\n{yaml_str}---\n\n{content.strip()}\n"
    
    # 儲存到文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    """主程序"""
    # 獲取所有Markdown文件
    markdown_files = glob.glob(os.path.join(POSTS_DIR, '*.markdown'))
    
    for file_path in markdown_files:
        file_name = os.path.basename(file_path)
        print(f"處理文件: {file_name}")
        
        # 跳過測試文件和隱藏文件
        if file_name.startswith('.') or 'test' in file_name.lower():
            print(f"跳過文件: {file_name}")
            continue
        
        # 提取YAML和內容
        yaml_data, content = extract_yaml_and_content(file_path)
        
        # 優化YAML
        yaml_data = optimize_yaml(yaml_data, file_name)
        
        # 優化內容
        content = optimize_content(content)
        
        # 儲存優化後的文件
        save_markdown(file_path, yaml_data, content)
        
        print(f"完成優化: {file_name}")
    
    print(f"總共處理了 {len(markdown_files)} 個文件")

if __name__ == "__main__":
    main() 