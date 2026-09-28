import re

with open("pendants.html", "r") as f:
    html = f.read()

# 1. Update style tag with mobile media query
style_add = """
      /* Mobile responsiveness */
      @media (max-width: 768px) {
        .hero-observatory .hero-studio-title {
          font-size: clamp(4rem, 15vw, 6rem) !important;
          line-height: 1 !important;
          margin-bottom: 1rem !important;
        }
        .hero-observatory .hero-footer-copy {
          align-items: center !important;
          text-align: center !important;
        }
        .hero-observatory .hero-footer-copy p {
          text-align: center !important;
        }
        .hero.hero-observatory .hero-content-bottom {
          align-items: center !important;
        }
        .pendants-detail-callout {
          align-items: center !important;
          text-align: center !important;
        }
        .pendants-detail-callout .detail-item {
          text-align: center !important;
        }
        .gallery-intro-section, .two-styles-section, .pendant-divider-section {
          padding: 3rem 1.5rem !important;
        }
        .intro-header-row {
          flex-direction: column !important;
          padding: 0 0 2.5rem 0 !important;
          gap: 1.5rem !important;
        }
        .intro-header-row h2 {
          font-size: 2.25rem !important;
        }
        .gallery-strip {
          display: flex !important;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          gap: 1rem;
          padding-bottom: 1rem;
        }
        .gallery-strip > div {
          flex: 0 0 75%;
          scroll-snap-align: center;
        }
        .two-styles-grid, .hardware-grid {
          grid-template-columns: 1fr !important;
        }
      }
    </style>
"""
html = html.replace("    </style>", style_add)

# 2. Add classes to elements
html = html.replace('<section style="background-color: var(--base-400); padding: 3rem 0 0 0;">', '<section class="gallery-intro-section" style="background-color: var(--base-400); padding: 3rem 0 0 0;">')
html = html.replace('<div style="display: flex; align-items: flex-start; gap: 4rem; padding: 0 4rem 2.5rem 4rem; border-bottom: 1px solid rgba(242,238,218,0.12);">', '<div class="intro-header-row" style="display: flex; align-items: flex-start; gap: 4rem; padding: 0 4rem 2.5rem 4rem; border-bottom: 1px solid rgba(242,238,218,0.12);">')
html = html.replace('<div style="display: grid; grid-template-columns: repeat(6, 1fr); width: 100%;">', '<div class="gallery-strip" style="display: grid; grid-template-columns: repeat(6, 1fr); width: 100%;">')

html = html.replace('<section style="background-color: var(--base-400); padding: 3rem 4rem;">', '<section class="two-styles-section" style="background-color: var(--base-400); padding: 3rem 4rem;">')
html = html.replace('<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">', '<div class="two-styles-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;">')

html = html.replace('<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">', '<div class="hardware-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">')

with open("pendants.html", "w") as f:
    f.write(html)
