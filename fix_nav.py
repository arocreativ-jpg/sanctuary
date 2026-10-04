import glob
for file in glob.glob('*.html'):
    with open(file, 'r') as f:
        content = f.read()
    
    # Simple replace
    new_content = content.replace('<div class="nav-item"><a href="/about">About</a></div>\n          <div class="nav-item"><a href="/about2.html">About 2</a></div>', '<div class="nav-item"><a href="/about2.html">About</a></div>')
    new_content = new_content.replace('<div class="nav-item"><a href="/about">About</a></div>\n        <div class="nav-item"><a href="/about2.html">About 2</a></div>', '<div class="nav-item"><a href="/about2.html">About</a></div>')

    # Also handle if they are on separate lines with varying spaces
    if '<div class="nav-item"><a href="/about">About</a></div>' in new_content:
        new_content = new_content.replace('<div class="nav-item"><a href="/about">About</a></div>\n', '')
        
    if new_content != content:
        with open(file, 'w') as f:
            f.write(new_content)
        print("Updated", file)
