#!/usr/bin/env node
/**
 * convert-to-webp.js
 * Converts all jpg/jpeg/png images in public/ to WebP,
 * then updates all HTML, CSS, and JS file references accordingly.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "public");
const SOURCE_DIR = path.join(__dirname);

// Extensions to convert
const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"];
// Extensions of source files to update references in
const SOURCE_EXTS = [".html", ".css", ".js"];

// ─── Step 1: Find all images ──────────────────────────────────────────────────
function findImages(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findImages(fullPath));
    } else if (IMAGE_EXTS.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── Step 2: Convert each image to WebP ───────────────────────────────────────
function convertToWebP(imagePath) {
  const webpPath = imagePath.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i, ".webp");
  if (fs.existsSync(webpPath)) {
    console.log(`  [SKIP] Already exists: ${path.relative(PUBLIC_DIR, webpPath)}`);
    return { original: imagePath, webp: webpPath, skipped: true };
  }
  try {
    execSync(`cwebp -q 85 "${imagePath}" -o "${webpPath}"`, { stdio: "pipe" });
    console.log(`  [OK]   ${path.relative(PUBLIC_DIR, imagePath)} → .webp`);
    return { original: imagePath, webp: webpPath, skipped: false };
  } catch (e) {
    console.error(`  [ERR]  Failed: ${imagePath}`, e.message);
    return null;
  }
}

// ─── Step 3: Build replacement map (public-relative paths) ────────────────────
function buildReplacementMap(conversions) {
  const map = {};
  for (const c of conversions) {
    if (!c) continue;
    // e.g. /public/index/hero.webp  → /index/hero.webp (the URL path used in HTML/CSS)
    const originalRel = "/" + path.relative(PUBLIC_DIR, c.original).replace(/\\/g, "/");
    const webpRel = "/" + path.relative(PUBLIC_DIR, c.webp).replace(/\\/g, "/");
    map[originalRel] = webpRel;

    // Also add version without leading slash for CSS url() etc.
    const noSlashOrig = originalRel.slice(1);
    const noSlashWebp = webpRel.slice(1);
    map[noSlashOrig] = noSlashWebp;
  }
  return map;
}

// ─── Step 4: Update references in source files ────────────────────────────────
function findSourceFiles(dir) {
  let results = [];
  const skip = ["node_modules", "dist", ".git"];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skip.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findSourceFiles(fullPath));
    } else if (SOURCE_EXTS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

function updateReferences(filePath, replacementMap) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  for (const [original, webp] of Object.entries(replacementMap)) {
    // Escape special regex chars in the original path
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "g");
    if (regex.test(content)) {
      content = content.replace(new RegExp(escaped, "g"), webp);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`  [UPDATED] ${path.relative(SOURCE_DIR, filePath)}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
console.log("🔍 Finding images in public/...");
const images = findImages(PUBLIC_DIR);
console.log(`   Found ${images.length} images\n`);

console.log("🔄 Converting to WebP...");
const conversions = images.map(convertToWebP).filter(Boolean);
const converted = conversions.filter((c) => !c.skipped);
console.log(`\n   ✓ ${converted.length} converted, ${conversions.length - converted.length} skipped\n`);

console.log("📝 Building replacement map...");
const replacementMap = buildReplacementMap(conversions);
console.log(`   ${Object.keys(replacementMap).length / 2} unique path mappings\n`);

console.log("✏️  Updating references in source files...");
const sourceFiles = findSourceFiles(SOURCE_DIR);
console.log(`   Scanning ${sourceFiles.length} files...`);
for (const file of sourceFiles) {
  updateReferences(file, replacementMap);
}

console.log("\n✅ Done! All images converted and references updated.");
console.log("   Original images are preserved alongside .webp versions.");
console.log("   Run 'npm run build' to rebuild the production bundle.");
