import os
import glob
import re

new_nav = """    <nav>
      <div class="nav-container">
        <div class="nav-bg"></div>
      </div>
      <div class="nav-mobile-header">
        <p class="nav-logo">SUB SANCTUARY</p>
        <div class="nav-menu-toggle">
          <span>MENU</span>
          <svg class="hamburger-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="1.5" fill="none">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="15" y2="18"></line>
          </svg>
        </div>
      </div>
      <div class="nav-overlay">
        <div class="nav-items">
          <div class="nav-item"><a href="/">HOME <span class="arrow">→</span></a></div>
          <div class="nav-item"><a href="/about">ABOUT <span class="arrow">→</span></a></div>
          <div class="nav-item"><a href="/about2.html">ABOUT 2 <span class="arrow">→</span></a></div>
          <div class="nav-item"><a href="/portfolio">PORTFOLIO <span class="arrow">→</span></a></div>
          <div class="nav-item"><a href="/shop">SHOP <span class="arrow">→</span></a></div>
          <div class="nav-item"><a href="/engraving">ENGRAVING <span class="arrow">→</span></a></div>
          <div class="nav-item"><a href="/pendants">CUSTOM PENDANTS <span class="arrow">→</span></a></div>
        </div>
        <div class="nav-footer">
          <div class="mode-icon-wrapper" id="light-mode-toggle">
            <svg class="mode-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
          <div class="mode-text">DARK / LIGHT</div>
        </div>
      </div>
    </nav>"""

for filepath in glob.glob("*.html"):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Replace the <nav>...</nav> block
    # Note: re.DOTALL is needed to match across newlines
    pattern = re.compile(r'<nav>.*?</nav>', re.DOTALL)
    new_content = pattern.sub(new_nav, content)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

