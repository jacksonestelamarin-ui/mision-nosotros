import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

// Grid Dimensions:
// Total width: 512px, Total height: 336px
const SHEET_WIDTH = 512;
const SHEET_HEIGHT = 336;

const png = new PNG({
  width: SHEET_WIDTH,
  height: SHEET_HEIGHT,
  colorType: 6, // RGBA
});

// Helper to set pixel color (hex: "#RRGGBB" or rgba)
function setPixel(x, y, color, opacity = 1.0) {
  if (x < 0 || x >= SHEET_WIDTH || y < 0 || y >= SHEET_HEIGHT) return;
  const idx = (SHEET_WIDTH * y + x) << 2;

  let r = 0, g = 0, b = 0, a = Math.round(opacity * 255);
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    }
  }

  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

function fillRect(x, y, w, h, color, opacity = 1.0) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      setPixel(x + dx, y + dy, color, opacity);
    }
  }
}

// -------------------------------------------------------------
// Jackson Sprites (Row 0: y=0..95, 64x96 per frame)
// -------------------------------------------------------------
function drawJacksonBase(offsetX, offsetY, options = {}) {
  const {
    isWalking = 0, // 0: idle, 1: walk1, 2: walk2
    isJumping = false,
    isKicking = false,
    isHurt = false,
    isVictory = false,
    isWedding = false
  } = options;

  const skin = '#fde68a';
  const hair = '#1c1917';
  const fade = '#44403c';
  const shirt = isWedding ? '#ffffff' : '#2563eb';
  const shirtHighlight = isWedding ? '#f8fafc' : '#3b82f6';
  const shirtShadow = isWedding ? '#e2e8f0' : '#1d4ed8';
  const pants = isWedding ? '#ffffff' : '#0f172a';
  const shoes = '#f8fafc';
  const glassesFrame = '#000000';
  const glassesLens = '#38bdf8';

  if (isHurt) {
    // Recoiling back pose
    fillRect(offsetX + 16, offsetY + 6, 28, 8, hair);
    fillRect(offsetX + 14, offsetY + 12, 32, 8, hair);
    fillRect(offsetX + 16, offsetY + 20, 28, 20, skin);
    // Crooked glasses
    fillRect(offsetX + 18, offsetY + 26, 10, 10, glassesFrame);
    fillRect(offsetX + 32, offsetY + 24, 10, 10, glassesFrame);
    fillRect(offsetX + 20, offsetY + 28, 6, 6, glassesLens);
    fillRect(offsetX + 34, offsetY + 26, 6, 6, glassesLens);
    // Leaning Body & Arms
    fillRect(offsetX + 10, offsetY + 40, 36, 26, shirt);
    fillRect(offsetX + 14, offsetY + 66, 28, 22, pants);
    fillRect(offsetX + 8, offsetY + 88, 16, 8, shoes);
    fillRect(offsetX + 32, offsetY + 88, 16, 8, shoes);
    return;
  }

  if (isVictory) {
    // Both arms raised
    fillRect(offsetX + 18, offsetY + 2, 28, 8, hair);
    fillRect(offsetX + 16, offsetY + 8, 32, 8, hair);
    fillRect(offsetX + 18, offsetY + 16, 28, 20, skin);
    // Glasses & Big Cheerful smile
    fillRect(offsetX + 20, offsetY + 22, 10, 10, glassesFrame);
    fillRect(offsetX + 34, offsetY + 22, 10, 10, glassesFrame);
    fillRect(offsetX + 22, offsetY + 24, 6, 6, glassesLens);
    fillRect(offsetX + 36, offsetY + 24, 6, 6, glassesLens);
    fillRect(offsetX + 26, offsetY + 30, 12, 4, '#e11d48');
    // Raised arms
    fillRect(offsetX + 4, offsetY + 16, 10, 24, shirt);
    fillRect(offsetX + 50, offsetY + 16, 10, 24, shirt);
    fillRect(offsetX + 4, offsetY + 8, 10, 8, skin);
    fillRect(offsetX + 50, offsetY + 8, 10, 8, skin);
    // Body & Pants
    fillRect(offsetX + 14, offsetY + 36, 36, 26, shirt);
    fillRect(offsetX + 16, offsetY + 62, 32, 26, pants);
    fillRect(offsetX + 10, offsetY + 88, 16, 8, shoes);
    fillRect(offsetX + 38, offsetY + 88, 16, 8, shoes);
    // Yellow victory sparkles
    fillRect(offsetX + 2, offsetY + 2, 6, 6, '#fef08a');
    fillRect(offsetX + 56, offsetY + 4, 6, 6, '#fef08a');
    return;
  }

  if (isKicking) {
    // High kick pose
    fillRect(offsetX + 14, offsetY + 4, 28, 8, hair);
    fillRect(offsetX + 12, offsetY + 10, 32, 8, hair);
    fillRect(offsetX + 14, offsetY + 18, 26, 20, skin);
    // Glasses
    fillRect(offsetX + 16, offsetY + 24, 9, 9, glassesFrame);
    fillRect(offsetX + 28, offsetY + 24, 9, 9, glassesFrame);
    fillRect(offsetX + 18, offsetY + 26, 5, 5, glassesLens);
    fillRect(offsetX + 30, offsetY + 26, 5, 5, glassesLens);
    // Body
    fillRect(offsetX + 10, offsetY + 38, 32, 24, shirt);
    // Standing leg
    fillRect(offsetX + 12, offsetY + 62, 14, 26, pants);
    fillRect(offsetX + 8, offsetY + 88, 18, 8, shoes);
    // Extended Kick Leg
    fillRect(offsetX + 32, offsetY + 48, 22, 14, pants);
    fillRect(offsetX + 52, offsetY + 46, 12, 18, shoes);
    // Kick Impact VFX
    fillRect(offsetX + 58, offsetY + 40, 6, 26, '#fef08a');
    return;
  }

  // Standard / Walk / Jump / Wedding
  const legShift1 = isWalking === 1 ? -4 : (isWalking === 2 ? 4 : 0);
  const legShift2 = isWalking === 1 ? 4 : (isWalking === 2 ? -4 : 0);
  const bodyY = isJumping ? offsetY + 4 : offsetY + 12;

  // Hair & Fade
  fillRect(offsetX + 18, bodyY - 10, 28, 6, hair);
  fillRect(offsetX + 16, bodyY - 4, 32, 6, hair);
  fillRect(offsetX + 14, bodyY + 2, 36, 6, hair);
  fillRect(offsetX + 14, bodyY + 8, 4, 10, fade);
  fillRect(offsetX + 46, bodyY + 8, 4, 10, fade);

  // Face
  fillRect(offsetX + 18, bodyY + 8, 28, 20, skin);
  // Glasses
  fillRect(offsetX + 20, bodyY + 14, 10, 10, glassesFrame);
  fillRect(offsetX + 34, bodyY + 14, 10, 10, glassesFrame);
  fillRect(offsetX + 30, bodyY + 16, 4, 3, glassesFrame);
  fillRect(offsetX + 22, bodyY + 16, 6, 6, glassesLens);
  fillRect(offsetX + 36, bodyY + 16, 6, 6, glassesLens);
  // Smile
  fillRect(offsetX + 28, bodyY + 24, 8, 3, '#e11d48');

  // Shirt / Jacket
  fillRect(offsetX + 14, bodyY + 28, 36, 26, shirt);
  fillRect(offsetX + 18, bodyY + 28, 28, 4, shirtHighlight);
  fillRect(offsetX + 14, bodyY + 50, 36, 4, shirtShadow);
  if (isWedding) {
    fillRect(offsetX + 20, bodyY + 34, 4, 4, '#ef4444'); // Boutonniere
  }

  // Arms
  fillRect(offsetX + 8, bodyY + 28, 6, 20, shirt);
  fillRect(offsetX + 50, bodyY + 28, 6, 20, shirt);
  fillRect(offsetX + 8, bodyY + 48, 6, 6, skin);
  fillRect(offsetX + 50, bodyY + 48, 6, 6, skin);

  // Pants & Legs
  fillRect(offsetX + 16 + legShift1, bodyY + 54, 14, 24, pants);
  fillRect(offsetX + 34 + legShift2, bodyY + 54, 14, 24, pants);

  // Shoes
  fillRect(offsetX + 12 + legShift1, bodyY + 78, 18, 8, shoes);
  fillRect(offsetX + 34 + legShift2, bodyY + 78, 18, 8, shoes);
}

// -------------------------------------------------------------
// Carlos Sprites (Row 1: y=96..191, 64x96 per frame)
// -------------------------------------------------------------
function drawCarlosBase(offsetX, offsetY, options = {}) {
  const { isTossing = false, isHurt = false, isDefeated = false } = options;

  if (isDefeated) {
    // Horizontal KO pose
    fillRect(offsetX + 8, offsetY + 54, 20, 20, '#f5d0fe');
    fillRect(offsetX + 6, offsetY + 48, 22, 10, '#1c1917');
    fillRect(offsetX + 28, offsetY + 50, 32, 24, '#374151');
    fillRect(offsetX + 60, offsetY + 54, 24, 20, '#b45309');
    fillRect(offsetX + 16, offsetY + 30, 10, 10, '#fef08a');
    fillRect(offsetX + 36, offsetY + 26, 8, 8, '#fef08a');
    return;
  }

  const hair = '#1c1917';
  const skin = '#f5d0fe';
  const glasses = '#0f172a';
  const shirt = isHurt ? '#dc2626' : '#374151';
  const shorts = '#b45309';

  // Hair
  fillRect(offsetX + 16, offsetY + 4, 32, 10, hair);
  fillRect(offsetX + 12, offsetY + 12, 40, 8, hair);
  // Head
  fillRect(offsetX + 16, offsetY + 18, 32, 22, skin);
  // Glasses
  fillRect(offsetX + 20, offsetY + 26, 10, 8, glasses);
  fillRect(offsetX + 34, offsetY + 26, 10, 8, glasses);
  // Beard
  fillRect(offsetX + 18, offsetY + 34, 28, 8, '#374151');

  // Shirt
  fillRect(offsetX + 12, offsetY + 40, 40, 26, shirt);
  fillRect(offsetX + 26, offsetY + 40, 12, 26, skin); // Open shirt

  if (isTossing) {
    // Extended arm throwing pigeon
    fillRect(offsetX + 48, offsetY + 38, 16, 10, skin);
    fillRect(offsetX + 58, offsetY + 40, 4, 6, '#1e1b4b'); // Tattoo
  } else {
    // Arms at side
    fillRect(offsetX + 6, offsetY + 40, 6, 20, shirt);
    fillRect(offsetX + 52, offsetY + 40, 6, 20, shirt);
  }

  // Shorts
  fillRect(offsetX + 14, offsetY + 66, 36, 18, shorts);
  // Legs & Sandals
  fillRect(offsetX + 16, offsetY + 84, 12, 8, skin);
  fillRect(offsetX + 36, offsetY + 84, 12, 8, skin);
  fillRect(offsetX + 14, offsetY + 90, 16, 4, '#1e1b4b');
  fillRect(offsetX + 34, offsetY + 90, 16, 4, '#1e1b4b');

  if (isHurt) {
    // Impact Flash
    fillRect(offsetX + 24, offsetY + 44, 16, 16, '#fef08a');
  }
}

// -------------------------------------------------------------
// Eliza Sprites (Row 2: y=192..287, 64x96 per frame)
// -------------------------------------------------------------
function drawElizaBase(offsetX, offsetY, options = {}) {
  const { isWalking = 0, isReunion = false, isWedding = false } = options;

  const hair = '#fde047';
  const skin = '#fef3c7';
  const dress = isWedding ? '#ffffff' : '#3b82f6';
  const dressLace = isWedding ? '#f8fafc' : '#60a5fa';
  const shoes = isWedding ? '#ffffff' : '#94a3b8';

  if (isWedding) {
    // Bridal Veil
    fillRect(offsetX + 10, offsetY + 8, 44, 70, '#ffffff', 0.6);
  }

  // Blonde Hair
  fillRect(offsetX + 16, offsetY + 2, 32, 10, hair);
  fillRect(offsetX + 12, offsetY + 10, 40, 12, hair);
  fillRect(offsetX + 10, offsetY + 20, 14, 30, hair);
  fillRect(offsetX + 40, offsetY + 20, 14, 30, hair);

  // Face & Blue Eyes
  fillRect(offsetX + 18, offsetY + 20, 28, 20, skin);
  fillRect(offsetX + 22, offsetY + 26, 7, 7, '#1d4ed8');
  fillRect(offsetX + 35, offsetY + 26, 7, 7, '#1d4ed8');
  fillRect(offsetX + 24, offsetY + 27, 3, 3, '#ffffff');
  fillRect(offsetX + 37, offsetY + 27, 3, 3, '#ffffff');
  fillRect(offsetX + 28, offsetY + 34, 8, 3, '#e11d48');

  // Dress
  const sway = isWalking === 1 ? -3 : (isWalking === 2 ? 3 : 0);
  fillRect(offsetX + 16 + sway, offsetY + 40, 32, 46, dress);
  fillRect(offsetX + 12, offsetY + 40, 40, 14, dressLace);

  if (isReunion) {
    // Arms outstretched
    fillRect(offsetX + 2, offsetY + 42, 18, 10, skin);
    fillRect(offsetX + 44, offsetY + 42, 18, 10, skin);
  }

  if (isWedding) {
    // Bouquet
    fillRect(offsetX + 26, offsetY + 54, 12, 12, '#ef4444');
    fillRect(offsetX + 24, offsetY + 52, 8, 8, '#f43f5e');
    fillRect(offsetX + 32, offsetY + 52, 8, 8, '#fde047');
  }

  // Shoes
  fillRect(offsetX + 18, offsetY + 86, 12, 8, shoes);
  fillRect(offsetX + 34, offsetY + 86, 12, 8, shoes);
}

// -------------------------------------------------------------
// Paloma / Pigeon Sprites (Row 3: y=288..335, 48x48 per frame)
// -------------------------------------------------------------
function drawPalomaBase(offsetX, offsetY, options = {}) {
  const { isFalling = false, isOnGround = false, isDestroyed = false } = options;

  if (isDestroyed) {
    // Explosion + Feathers
    fillRect(offsetX + 12, offsetY + 8, 24, 32, '#fef08a');
    fillRect(offsetX + 8, offsetY + 12, 32, 24, '#f97316');
    fillRect(offsetX + 2, offsetY + 4, 8, 14, '#cbd5e1');
    fillRect(offsetX + 38, offsetY + 6, 8, 14, '#cbd5e1');
    fillRect(offsetX + 20, offsetY + 2, 8, 8, '#ef4444'); // Heart
    return;
  }

  const grey = '#9ca3af';
  const darkGrey = '#6b7280';
  const green = '#10b981';
  const beak = '#f97316';

  if (isOnGround) {
    // Pecking on ground
    fillRect(offsetX + 10, offsetY + 18, 28, 18, grey);
    fillRect(offsetX + 8, offsetY + 10, 12, 12, grey);
    fillRect(offsetX + 2, offsetY + 14, 8, 5, beak);
    fillRect(offsetX + 12, offsetY + 12, 4, 4, green);
    fillRect(offsetX + 16, offsetY + 36, 5, 10, '#f43f5e');
    fillRect(offsetX + 26, offsetY + 36, 5, 10, '#f43f5e');
    return;
  }

  if (isFalling) {
    // Vertical falling
    fillRect(offsetX + 14, offsetY + 10, 20, 28, grey);
    fillRect(offsetX + 16, offsetY + 34, 12, 10, grey);
    fillRect(offsetX + 18, offsetY + 42, 8, 4, beak);
    fillRect(offsetX + 2, offsetY + 8, 12, 8, '#cbd5e1');
    fillRect(offsetX + 34, offsetY + 6, 12, 8, '#cbd5e1');
    return;
  }

  // Flying
  fillRect(offsetX + 12, offsetY + 14, 24, 18, grey);
  fillRect(offsetX + 6, offsetY + 10, 12, 12, grey);
  fillRect(offsetX + 0, offsetY + 14, 8, 5, beak);
  fillRect(offsetX + 10, offsetY + 12, 4, 4, green);
  // Spread wings
  fillRect(offsetX + 12, offsetY + 2, 14, 14, darkGrey);
  fillRect(offsetX + 20, offsetY + 28, 14, 14, darkGrey);
}

// Generate all frames into PNG grid!
// Row 0: Jackson
drawJacksonBase(0, 0, { isWalking: 0 }); // idle
drawJacksonBase(64, 0, { isWalking: 1 }); // walk1
drawJacksonBase(128, 0, { isWalking: 2 }); // walk2
drawJacksonBase(192, 0, { isJumping: true }); // jump
drawJacksonBase(256, 0, { isKicking: true }); // kick
drawJacksonBase(320, 0, { isHurt: true }); // hurt
drawJacksonBase(384, 0, { isVictory: true }); // victory
drawJacksonBase(448, 0, { isWedding: true }); // wedding

// Row 1: Carlos
drawCarlosBase(0, 96, { isTossing: false }); // idle
drawCarlosBase(64, 96, { isTossing: true }); // attack
drawCarlosBase(128, 96, { isHurt: true }); // hurt
drawCarlosBase(192, 96, { isDefeated: true }); // defeated

// Row 2: Eliza
drawElizaBase(0, 192, { isWalking: 0 }); // idle
drawElizaBase(64, 192, { isWalking: 1 }); // walk1
drawElizaBase(128, 192, { isWalking: 2 }); // walk2
drawElizaBase(192, 192, { isReunion: true }); // reunion
drawElizaBase(256, 192, { isWedding: true }); // wedding

// Row 3: Paloma
drawPalomaBase(0, 288, {}); // flying
drawPalomaBase(48, 288, { isFalling: true }); // falling
drawPalomaBase(96, 288, { isOnGround: true }); // ground
drawPalomaBase(144, 288, { isDestroyed: true }); // destroyed

// Save to /public/assets/sprites/spritesheet.png
const outPath = path.join(process.cwd(), 'public', 'assets', 'sprites', 'spritesheet.png');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
png.pack().pipe(fs.createWriteStream(outPath)).on('finish', () => {
  console.log('Sprite sheet successfully saved to:', outPath);
});
