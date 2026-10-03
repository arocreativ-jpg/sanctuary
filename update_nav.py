import re

with open("css/nav.css", "r") as f:
    content = f.read()

new_css = """@media (max-width: 1000px) {
  nav {
    top: 2rem;
    width: calc(100% - 4rem);
    max-width: 400px;
    height: auto;
    flex-direction: column;
    padding: 0;
    border-radius: 12px;
    background: linear-gradient(180deg, rgba(238, 100, 54, 0.95) 0%, rgba(220, 90, 45, 0.98) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    transition: border-radius 0.4s ease;
  }

  nav.nav-open {
    border-radius: 12px 12px 24px 24px;
  }

  nav .nav-bg {
    display: none;
  }

  nav .nav-mobile-header {
    position: relative;
    width: 100%;
    height: 3.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    z-index: 10;
    box-sizing: border-box;
  }

  nav .nav-mobile-header p {
    font-family: 'Geist Mono', monospace;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--base-400);
    margin: 0;
  }

  nav .nav-menu-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  nav .nav-menu-toggle::after {
    content: "";
    display: block;
    width: 20px;
    height: 2px;
    background-color: currentColor;
    box-shadow: 0 -6px 0 currentColor, 0 6px 0 currentColor;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  nav.nav-open .nav-menu-toggle::after {
    box-shadow: none;
    transform: rotate(45deg);
  }

  nav .nav-overlay {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    margin: 0;
    z-index: 1;
    filter: none;
  }

  nav.nav-open .nav-overlay {
    max-height: 600px;
  }

  nav .nav-overlay::before {
    display: none;
  }

  nav .nav-items {
    width: 100%;
    padding: 0 1.5rem 2rem 1.5rem;
    flex-direction: column;
    align-items: stretch;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  nav.nav-open .nav-items {
    opacity: 1;
    transition: opacity 0.4s ease 0.1s;
  }

  nav .nav-item {
    width: 100%;
    border-bottom: 1px solid rgba(20,20,20,0.1);
    transform: translateY(10px);
    opacity: 0;
    transition: transform 0.4s ease, opacity 0.4s ease;
    pointer-events: none;
  }

  nav.nav-open .nav-item {
    pointer-events: all;
  }

  nav.nav-open .nav-item:nth-child(1) { transition-delay: 0.05s; transform: translateY(0); opacity: 1; }
  nav.nav-open .nav-item:nth-child(2) { transition-delay: 0.1s; transform: translateY(0); opacity: 1; }
  nav.nav-open .nav-item:nth-child(3) { transition-delay: 0.15s; transform: translateY(0); opacity: 1; }
  nav.nav-open .nav-item:nth-child(4) { transition-delay: 0.2s; transform: translateY(0); opacity: 1; }
  nav.nav-open .nav-item:nth-child(5) { transition-delay: 0.25s; transform: translateY(0); opacity: 1; }
  nav.nav-open .nav-item:nth-child(6) { transition-delay: 0.3s; transform: translateY(0); opacity: 1; }
  nav.nav-open .nav-item:nth-child(7) { transition-delay: 0.35s; transform: translateY(0); opacity: 1; }

  nav .nav-item a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 0;
    font-family: 'Geist Mono', monospace;
    font-size: 0.85rem;
    color: var(--base-400);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: left;
    width: 100%;
    text-decoration: none;
  }
  
  nav .nav-item a::after {
    content: "→";
    font-family: sans-serif;
    font-size: 1rem;
    opacity: 0.7;
    transition: transform 0.3s ease;
  }
  
  nav .nav-item a:hover::after {
    transform: translateX(4px);
  }

  nav .nav-item#light-mode-toggle {
    border-bottom: none;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.5rem;
    margin-top: 0.5rem;
    transform: translateY(10px);
    opacity: 0;
    transition: transform 0.4s ease, opacity 0.4s ease;
  }

  nav.nav-open .nav-item#light-mode-toggle {
    transition-delay: 0.4s;
    transform: translateY(0);
    opacity: 1;
  }
  
  nav .nav-item#light-mode-toggle::after {
    content: "DARK / LIGHT";
    font-family: 'Geist Mono', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--base-400);
    position: absolute;
    right: 0;
  }

  nav .mode-icon {
    font-size: 1.2rem;
    line-height: 1;
    display: block;
  }
}"""

pattern = re.compile(r'@media \(max-width: 1000px\) \{.*?\}(?=\n@media |\Z)', re.DOTALL)
new_content = pattern.sub(new_css, content)

with open("css/nav.css", "w") as f:
    f.write(new_content)
print("Updated nav.css")
