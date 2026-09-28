// webgl particle system with mouse distortion
const PV = {
  config: {
    canvasBg: "#141414",
    logoSize: 2000,
    distortionRadius: 2000,
    forceStrength: 0.05,
    maxDisplacement: 1000,
    returnForce: 0.1,
    logoPath: "/lab/hero-visual.webp",
    particleSpacing: 2,
  },
  canvas: null,
  gl: null,
  program: null,
  geometry: null,
  particles: [],
  posArray: null,
  colorArray: null,
  mouse: { x: 0, y: 0 },
  execCount: 0,
  isMobile: false,
  animFrame: null,
  isAnimating: false,
};

// initialization
document.addEventListener("DOMContentLoaded", init);

function init() {
  PV.canvas = document.getElementById("particle-canvas");
  if (!PV.canvas) return;

  PV.isMobile = window.innerWidth < 1000;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  PV.canvas.width = innerWidth * dpr;
  PV.canvas.height = innerHeight * dpr;
  PV.canvas.style.width = innerWidth + "px";
  PV.canvas.style.height = innerHeight + "px";

  PV.gl = PV.canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    powerPreference: "high-performance",
    desynchronized: true,
  });

  if (!PV.gl) return;

  PV.gl.enable(PV.gl.BLEND);
  PV.gl.blendFunc(PV.gl.SRC_ALPHA, PV.gl.ONE_MINUS_SRC_ALPHA);

  setupShaders();
  loadImage();

  if (!PV.isMobile) {
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
  }
  window.addEventListener("resize", handleResize);
}

// shader setup
function setupShaders() {
  const vs = `
    precision mediump float;
    uniform vec2 u_resolution;
    attribute vec2 a_position;
    attribute vec4 a_color;
    varying vec4 v_color;
    void main() {
      vec2 clip = (a_position / u_resolution * 2.0 - 1.0) * vec2(1.0, -1.0);
      v_color = a_color;
      gl_Position = vec4(clip, 0.0, 1.0);
      gl_PointSize = 3.0;
    }`;

  const fs = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
      if (v_color.a < 0.01) discard;
      float dist = length(gl_PointCoord - 0.5);
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
    }`;

  const vShader = PV.gl.createShader(PV.gl.VERTEX_SHADER);
  PV.gl.shaderSource(vShader, vs);
  PV.gl.compileShader(vShader);

  const fShader = PV.gl.createShader(PV.gl.FRAGMENT_SHADER);
  PV.gl.shaderSource(fShader, fs);
  PV.gl.compileShader(fShader);

  PV.program = PV.gl.createProgram();
  PV.gl.attachShader(PV.program, vShader);
  PV.gl.attachShader(PV.program, fShader);
  PV.gl.linkProgram(PV.program);
}

function loadImage() {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    processImage(img);
    setupBuffers();
    startLoop();
  };
  img.src = PV.config.logoPath;
}

function processImage(img) {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");

  let w = PV.config.logoSize;
  let h = Math.round(PV.config.logoSize * (img.height / img.width));

  if (PV.isMobile) {
    w = Math.round(w * 0.6);
    h = Math.round(h * 0.6);
  }

  c.width = w;
  c.height = h;
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const targetW = PV.canvas.width;
  const targetH = PV.canvas.height;
  const offsetX = (targetW - w) / 2;
  const offsetY = (targetH - h) / 2;

  const step = PV.isMobile ? 3 : PV.config.particleSpacing;

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4;
      const alpha = data[idx + 3];

      if (alpha > 50) {
        const origX = offsetX + x;
        const origY = offsetY + y;
        PV.particles.push({
          x: origX,
          y: origY,
          ox: origX,
          oy: origY,
          vx: 0,
          vy: 0,
          r: data[idx] / 255,
          g: data[idx + 1] / 255,
          b: data[idx + 2] / 255,
          a: alpha / 255,
        });
      }
    }
  }

  const count = PV.particles.length;
  PV.posArray = new Float32Array(count * 2);
  PV.colorArray = new Float32Array(count * 4);

  for (let i = 0; i < count; i++) {
    const p = PV.particles[i];
    PV.posArray[i * 2] = p.x;
    PV.posArray[i * 2 + 1] = p.y;
    PV.colorArray[i * 4] = p.r;
    PV.colorArray[i * 4 + 1] = p.g;
    PV.colorArray[i * 4 + 2] = p.b;
    PV.colorArray[i * 4 + 3] = p.a;
  }
}

function setupBuffers() {
  const count = PV.particles.length;
  if (!count) return;

  PV.geometry = {
    posBuffer: PV.gl.createBuffer(),
    colorBuffer: PV.gl.createBuffer(),
    count: count,
  };

  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, PV.geometry.posBuffer);
  PV.gl.bufferData(PV.gl.ARRAY_BUFFER, PV.posArray, PV.gl.DYNAMIC_DRAW);

  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, PV.geometry.colorBuffer);
  PV.gl.bufferData(PV.gl.ARRAY_BUFFER, PV.colorArray, PV.gl.STATIC_DRAW);
}

function handleMouseMove(e) {
  const rect = PV.canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);

  PV.mouse.x = (e.clientX - rect.left) * dpr;
  PV.mouse.y = (e.clientY - rect.top) * dpr;
}

function updatePhysics() {
  if (PV.isMobile) return;

  const radiusSq = PV.config.distortionRadius * PV.config.distortionRadius;
  const count = PV.particles.length;

  for (let i = 0; i < count; i++) {
    const p = PV.particles[i];
    const dx = PV.mouse.x - p.x;
    const dy = PV.mouse.y - p.y;
    const distSq = dx * dx + dy * dy;

    if (distSq < radiusSq && distSq > 0) {
      const dist = Math.sqrt(distSq);
      const force = (1 - dist / PV.config.distortionRadius) * PV.config.forceStrength;
      const angle = Math.atan2(dy, dx);

      p.vx -= Math.cos(angle) * force * 50;
      p.vy -= Math.sin(angle) * force * 50;
    }

    const homeDx = p.ox - p.x;
    const homeDy = p.oy - p.y;

    p.vx += homeDx * PV.config.returnForce;
    p.vy += homeDy * PV.config.returnForce;

    p.vx *= 0.85;
    p.vy *= 0.85;

    p.x += p.vx;
    p.y += p.vy;

    const dispX = p.x - p.ox;
    const dispY = p.y - p.oy;
    const dispDist = Math.sqrt(dispX * dispX + dispY * dispY);

    if (dispDist > PV.config.maxDisplacement) {
      const angle = Math.atan2(dispY, dispX);
      p.x = p.ox + Math.cos(angle) * PV.config.maxDisplacement;
      p.y = p.oy + Math.sin(angle) * PV.config.maxDisplacement;
    }

    PV.posArray[i * 2] = p.x;
    PV.posArray[i * 2 + 1] = p.y;
  }
}

function render() {
  if (!PV.gl || !PV.geometry) return;

  updatePhysics();

  PV.gl.viewport(0, 0, PV.canvas.width, PV.canvas.height);
  PV.gl.clearColor(0.08, 0.08, 0.08, 0.0); // Transparent/Dark background
  PV.gl.clear(PV.gl.COLOR_BUFFER_BIT);

  PV.gl.useProgram(PV.program);

  const uRes = PV.gl.getUniformLocation(PV.program, "u_resolution");
  PV.gl.uniform2f(uRes, PV.canvas.width, PV.canvas.height);

  const aPos = PV.gl.getAttribLocation(PV.program, "a_position");
  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, PV.geometry.posBuffer);
  PV.gl.bufferSubData(PV.gl.ARRAY_BUFFER, 0, PV.posArray);
  PV.gl.enableVertexAttribArray(aPos);
  PV.gl.vertexAttribPointer(aPos, 2, PV.gl.FLOAT, false, 0, 0);

  const aCol = PV.gl.getAttribLocation(PV.program, "a_color");
  PV.gl.bindBuffer(PV.gl.ARRAY_BUFFER, PV.geometry.colorBuffer);
  PV.gl.enableVertexAttribArray(aCol);
  PV.gl.vertexAttribPointer(aCol, 4, PV.gl.FLOAT, false, 0, 0);

  PV.gl.drawArrays(PV.gl.POINTS, 0, PV.geometry.count);
}

function startLoop() {
  if (PV.isAnimating) return;
  PV.isAnimating = true;

  function loop() {
    render();
    PV.animFrame = requestAnimationFrame(loop);
  }
  loop();
}

function handleResize() {
  if (!PV.canvas) return;
  PV.isMobile = window.innerWidth < 1000;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  PV.canvas.width = innerWidth * dpr;
  PV.canvas.height = innerHeight * dpr;
  PV.canvas.style.width = innerWidth + "px";
  PV.canvas.style.height = innerHeight + "px";
}
