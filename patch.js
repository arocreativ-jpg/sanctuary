const fs = require('fs');

let html = fs.readFileSync('about.html', 'utf8');

// Find the hero section and remove it
const heroStart = html.indexOf('<section class="hero hero-observatory">');
const heroEnd = html.indexOf('</section>', heroStart) + 10;

// Find the bento section and remove it from bottom
const bentoStart = html.indexOf('<section class="bento-cta-section">');
const bentoEnd = html.indexOf('</section>', bentoStart) + 10;

if (heroStart !== -1 && bentoStart !== -1) {
    const bentoContent = html.substring(bentoStart, bentoEnd);
    
    // Remove bento from bottom first
    html = html.substring(0, bentoStart) + html.substring(bentoEnd);
    
    // Recalculate hero start/end because indices changed
    const newHeroStart = html.indexOf('<section class="hero hero-observatory">');
    const newHeroEnd = html.indexOf('</section>', newHeroStart) + 10;
    
    // Replace hero with bento
    html = html.substring(0, newHeroStart) + bentoContent + html.substring(newHeroEnd);
    
    fs.writeFileSync('about.html', html);
    console.log("Successfully replaced hero with bento grid.");
} else {
    console.log("Error finding sections.");
}
