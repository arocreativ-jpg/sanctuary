const fs = require('fs');

const perspective = 30;
const cardWidth = 18;
const cardHeight = 25;
const birthHeight = 2.6;
const exitHeight = 46;
const railBirth = -11;
const railExit = 44;
const fan = 3.3;
const rotBirth = 6;
const rotExit = 28;
const samples = 28;

function getTransform(u, dir) {
  const scale = (birthHeight / cardHeight) * Math.pow(exitHeight / birthHeight, u);
  const z = perspective * (1 - 1 / scale);
  const rail = railExit - (railExit - railBirth) * Math.pow(1 - u, fan);
  const turn = rotBirth + (rotExit - rotBirth) * u;
  return `translate3d(${dir * rail}cqw, 0, ${z}cqw) rotateY(${-dir * turn}deg)`;
}

let css = `
.corridor-section {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #050505;
  overflow: hidden;
  container-type: inline-size;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: white;
}
.corridor-content {
  position: relative;
  z-index: 10;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.corridor-badge {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.corridor-title {
  font-size: clamp(52px, 7.4vw, 112px);
  font-weight: 700;
  letter-spacing: -0.075em;
  line-height: 0.88;
  margin: 0 0 2rem 0;
  max-width: 800px;
}
.corridor-cta {
  background: white;
  color: #050505;
  border-radius: 999px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  box-shadow: 0 0 0 4px rgba(255,255,255,0.1), 0 10px 20px rgba(0,0,0,0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.corridor-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 0 6px rgba(255,255,255,0.15), 0 15px 25px rgba(0,0,0,0.6);
}
.corridor-top-bar {
  position: absolute;
  top: 2rem;
  left: 2rem;
  right: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
}
.corridor-logo {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.05em;
}
.corridor-play {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
}
@media (max-width: 768px) {
  .corridor-top-bar {
    top: 1rem;
    left: 1rem;
    right: 1rem;
  }
  .corridor-title {
    font-size: clamp(48px, 15vw, 72px);
  }
}
.corridor-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(5,5,5,0) 70%);
  z-index: 1;
  pointer-events: none;
}
.corridor-rail {
  position: absolute;
  top: 55%;
  left: 50%;
  width: 0;
  height: 0;
  perspective: 30cqw;
  transform-style: preserve-3d;
  z-index: 2;
  pointer-events: none;
}
.corridor-card {
  position: absolute;
  width: 18cqw;
  height: 25cqw;
  margin-top: -12.5cqw;
  margin-left: -9cqw;
  border-radius: 0.8cqw;
  overflow: hidden;
  box-shadow: 0 2cqw 5cqw rgba(0,0,0,0.8);
  border: 1px solid rgba(255,255,255,0.1);
  will-change: transform;
  backface-visibility: hidden;
  animation-duration: 18s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.corridor-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.corridor-card.left {
  animation-name: corridor-left;
}
.corridor-card.right {
  animation-name: corridor-right;
}

`;

let leftFrames = "";
let rightFrames = "";

for (let i = 0; i <= samples; i++) {
  const u = i / samples;
  const pct = (u * 100).toFixed(2);
  leftFrames += `  ${pct}% { transform: ${getTransform(u, -1)}; }\n`;
  rightFrames += `  ${pct}% { transform: ${getTransform(u, 1)}; }\n`;
}

css += `@keyframes corridor-left {\n${leftFrames}}\n`;
css += `@keyframes corridor-right {\n${rightFrames}}\n`;

fs.writeFileSync('css/corridor.css', css);
console.log('Generated CSS!');
