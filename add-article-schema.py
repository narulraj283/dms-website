#!/usr/bin/env python3
"""
Add SEO schema markup and meta tags to all article HTML files.
Adds:
- Article schema markup
- Canonical URLs
- Open Graph tags
- BreadcrumbList schema
"""

import os
import re
from datetime import datetime

articles_dir = "/tmp/dms-repo/articles"

def extract_title_from_html(content):
    """Extract text from <title> tag"""
    match = re.search(r'<title>([^<]+)</title>', content, re.IGNORECASE)
    if match:
        title = match.group(1).strip()
        # Remove common suffixes like " | DMS"
        title = re.sub(r'\s*\|\s*.*', '', title)
        return title
    return "Article"

def get_filename_from_path(filepath):
    """Get filename without extension"""
    return os.path.basename(filepath)

def create_article_schema(filename, headline):
    """Create Article schema.org markup"""
    return f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{headline}",
  "author": {{
    "@type": "Person",
    "name": "Naren Arulrajah",
    "url": "https://www.ekwa.com/about-naren/"
  }},
  "publisher": {{
    "@type": "Organization",
    "name": "Dental Marketing Society",
    "url": "https://dms.narenlife.com",
    "logo": {{"@type": "ImageObject", "url": "https://dms.narenlife.com/assets/logo.svg"}}
  }},
  "datePublished": "2026-03-05",
  "dateModified": "2026-03-06",
  "mainEntityOfPage": {{"@type": "WebPage", "@id": "https://dms.narenlife.com/articles/{filename}"}}
}}
</script>'''

def create_breadcrumb_schema(filename, headline):
    """Create BreadcrumbList schema"""
    return f'''<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://dms.narenlife.com/"}},
    {{"@type": "ListItem", "position": 2, "name": "Articles", "item": "https://dms.narenlife.com/pages/articles.html"}},
    {{"@type": "ListItem", "position": 3, "name": "{headline}", "item": "https://dms.narenlife.com/articles/{filename}"}}
  ]
}}
</script>'''

def create_og_tags(filename, headline):
    """Create Open Graph meta tags"""
    return f'''  <meta property="og:type" content="article">
  <meta property="og:url" content="https://dms.narenlife.com/articles/{filename}">
  <meta property="og:site_name" content="Dental Marketing Society">
  <meta name="twitter:card" content="summary_large_image">'''

def create_canonical(filename):
    """Create canonical link"""
    return f'''  <link rel="canonical" href="https://dms.narenlife.com/articles/{filename}">'''

def process_article(filepath):
    """Process a single article file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = get_filename_from_path(filepath)
    headline = extract_title_from_html(content)

    # Check if already has schema
    if 'Article' in content and '@type' in content:
        print(f"  {filename}: Already has schema, skipping")
        return False

    # Find the closing </head> tag
    head_close = content.find('</head>')
    if head_close == -1:
        print(f"  {filename}: No </head> tag found, skipping")
        return False

    # Prepare new markup
    article_schema = create_article_schema(filename, headline)
    breadcrumb_schema = create_breadcrumb_schema(filename, headline)
    canonical = create_canonical(filename)
    og_tags = create_og_tags(filename, headline)

    # Insert before </head>
    new_head = f"{article_schema}\n  {breadcrumb_schema}\n  {canonical}\n{og_tags}\n"

    # Remove existing og:type if present
    content = re.sub(r'\n\s*<meta property="og:type"[^>]*>', '', content)
    content = re.sub(r'\n\s*<meta property="og:url"[^>]*>', '', content)
    content = re.sub(r'\n\s*<meta property="og:site_name"[^>]*>', '', content)
    content = re.sub(r'\n\s*<meta name="twitter:card"[^>]*>', '', content)
    content = re.sub(r'\n\s*<link rel="canonical"[^>]*>', '', content)
    content = re.sub(r'\n\s*<script type="application/ld\+json">\s*\{\s*"@context"[^}]*\}\s*</script>', '', content, flags=re.DOTALL)

    # Insert new markup
    content = content.replace('</head>', f'{new_head}</head>', 1)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  {filename}: Added schema markup")
    return True

# Process all articles
print("Processing article files...")
if os.path.isdir(articles_dir):
    articles = [f for f in os.listdir(articles_dir) if f.endswith('.html')]
    count = 0
    for article in sorted(articles):
        filepath = os.path.join(articles_dir, article)
        if process_article(filepath):
            count += 1
    print(f"\nProcessed {count}/{len(articles)} articles")
else:
    print(f"Articles directory not found: {articles_dir}")
