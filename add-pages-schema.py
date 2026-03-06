#!/usr/bin/env python3
"""
Add canonical URLs and OG tags to all page HTML files.
"""

import os
import re

pages_dir = "/tmp/dms-repo/pages"

def get_filename_from_path(filepath):
    """Get filename"""
    return os.path.basename(filepath)

def extract_title_from_html(content):
    """Extract text from <title> tag"""
    match = re.search(r'<title>([^<]+)</title>', content, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return "Page"

def create_og_tags(filename, title):
    """Create Open Graph meta tags"""
    return f'''  <meta property="og:url" content="https://dms.narenlife.com/pages/{filename}">
  <meta property="og:site_name" content="Dental Marketing Society">
  <meta name="twitter:card" content="summary_large_image">'''

def create_canonical(filename):
    """Create canonical link"""
    return f'''  <link rel="canonical" href="https://dms.narenlife.com/pages/{filename}">'''

def process_page(filepath):
    """Process a single page file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    filename = get_filename_from_path(filepath)
    title = extract_title_from_html(content)

    # Find the closing </head> tag
    head_close = content.find('</head>')
    if head_close == -1:
        print(f"  {filename}: No </head> tag found, skipping")
        return False

    # Prepare new markup
    canonical = create_canonical(filename)
    og_tags = create_og_tags(filename, title)

    # Remove existing canonical and og tags
    content = re.sub(r'\n\s*<link rel="canonical"[^>]*>', '', content)
    content = re.sub(r'\n\s*<meta property="og:url"[^>]*>', '', content)
    content = re.sub(r'\n\s*<meta property="og:site_name"[^>]*>', '', content)
    content = re.sub(r'\n\s*<meta name="twitter:card"[^>]*>', '', content)

    # Insert before </head>
    new_markup = f"{canonical}\n{og_tags}\n"
    content = content.replace('</head>', f'{new_markup}</head>', 1)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  {filename}: Added tags")
    return True

# Process all pages
print("Processing page files...")
if os.path.isdir(pages_dir):
    pages = [f for f in os.listdir(pages_dir) if f.endswith('.html')]
    count = 0
    for page in sorted(pages):
        filepath = os.path.join(pages_dir, page)
        if process_page(filepath):
            count += 1
    print(f"\nProcessed {count}/{len(pages)} pages")
else:
    print(f"Pages directory not found: {pages_dir}")
