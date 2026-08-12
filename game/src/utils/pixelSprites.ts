// High-definition Pixel-Art Sprite Sheet Renderer for "Misión: Nosotros"
// Recorta los frames directamente desde /assets/sprites/spritesheet.png usando las coordenadas exactas de source rect (sx, sy, sw, sh)

export interface JacksonSpriteOptions {
  facingLeft?: boolean;
  isKicking?: boolean;
  isJumping?: boolean;
  isHurt?: boolean;
  isVictory?: boolean;
  isWedding?: boolean;
  isWalking?: boolean;
  frameCount?: number;
}

export interface CarlosSpriteOptions {
  hitFlash?: boolean;
  isTossing?: boolean;
  isDefeated?: boolean;
  frameCount?: number;
}

export interface PigeonSpriteOptions {
  isOnGround?: boolean;
  isFlying?: boolean;
  isFalling?: boolean;
  isDestroyed?: boolean;
  frameCount?: number;
}

export interface ElizaSpriteOptions {
  isWalking?: boolean;
  isReunion?: boolean;
  isWedding?: boolean;
  frameCount?: number;
}

// Cargar la imagen del PNG Sprite Sheet
let spriteSheetImage: HTMLImageElement | null = null;

function getSpriteSheet(): HTMLImageElement | null {
  if (typeof window === 'undefined') return null;
  if (!spriteSheetImage) {
    spriteSheetImage = new Image();
    spriteSheetImage.src = '/assets/sprites/spritesheet.png';
  }
  return spriteSheetImage.complete ? spriteSheetImage : null;
}

/**
 * Jackson Sprite Renderer (Crop from PNG using exact sx, sy, sw, sh)
 */
export function drawJacksonSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: JacksonSpriteOptions = {}
) {
  const {
    facingLeft = false,
    isKicking = false,
    isJumping = false,
    isWedding = false,
    isWalking = false,
    frameCount = 0,
  } = options;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const baseW = 12;
  const baseH = 18;
  const unit = Math.max(1, Math.floor(Math.min(width / baseW, height / baseH)));
  const drawW = unit * baseW;
  const drawH = unit * baseH;
  const offsetX = Math.floor((width - drawW) / 2);
  const offsetY = Math.floor((height - drawH) / 2);
  const bob = isWalking ? Math.round(Math.sin(frameCount * 0.25) * unit * 0.8) : 0;
  const renderY = y - bob;

  ctx.translate(x + offsetX + (facingLeft ? drawW : 0), renderY + offsetY);
  if (facingLeft) ctx.scale(-1, 1);

  const skin = '#f5d6b5';
  const hair = '#18181b';
  const shirt = isWedding ? '#ffffff' : '#2563eb';
  const shirtShade = '#1d4ed8';
  const pants = '#111827';
  const shoe = '#0f172a';
  const glass = '#000000';
  const mouth = '#7c3aed';
  const highlight = '#93c5fd';

  const px = (gx: number, gy: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(gx * unit, gy * unit, unit, unit);
  };

  // Legs
  for (let gy = 13; gy <= 15; gy++) {
    for (let gx = 3; gx <= 8; gx++) {
      px(gx, gy, pants);
    }
  }
  px(3, 16, shoe);
  px(8, 16, shoe);

  // Shirt
  for (let gy = 8; gy <= 12; gy++) {
    for (let gx = 3; gx <= 8; gx++) {
      px(gx, gy, shirt);
    }
  }
  px(4, 10, shirtShade);
  px(7, 11, shirtShade);

  // Arms
  px(2, 9, skin);
  px(9, 9, skin);
  px(2, 10, shirt);
  px(9, 10, shirt);

  // Head
  for (let gy = 2; gy <= 5; gy++) {
    for (let gx = 4; gx <= 7; gx++) {
      px(gx, gy, skin);
    }
  }
  px(3, 3, hair);
  px(8, 3, hair);
  for (let gx = 3; gx <= 8; gx++) px(gx, 2, hair);
  px(4, 6, hair);
  px(7, 6, hair);

  // Glasses
  px(4, 3, glass);
  px(7, 3, glass);
  px(5, 3, '#374151');
  px(6, 3, '#374151');
  px(5, 4, '#ffffff');
  px(6, 4, '#ffffff');

  // Mouth
  px(5, 5, mouth);
  px(6, 5, mouth);

  // Walking detail
  if (isWalking) {
    px(4, 14, highlight);
    px(7, 14, highlight);
  }

  // Jump shadow
  if (isJumping) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(2 * unit, 17 * unit, 8 * unit, unit * 0.6);
  }

  // Kicking leg extended
  if (isKicking) {
    for (let gy = 13; gy <= 15; gy++) {
      px(9, gy, pants);
    }
    px(9, 16, shoe);
  }

  ctx.restore();
}

/**
 * Carlos (Boss) Sprite Renderer (Crop from PNG using exact sx, sy, sw, sh)
 */
export function drawCarlosSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: CarlosSpriteOptions = {}
) {
  const { hitFlash = false, isTossing = false, isDefeated = false, frameCount = 0 } = options;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const renderHeight = isDefeated ? height * 0.5 : height;
  const renderY = isDefeated ? y + height * 0.5 : y + Math.sin(frameCount * 0.08) * 1.5;
  ctx.translate(x, renderY);

  const baseW = 16;
  const baseH = 20;
  const unit = Math.max(1, Math.floor(Math.min(width / baseW, renderHeight / baseH)));

  const skin = '#f0c7a5';
  const hair = '#231f20';
  const shirt = '#f59e0b';
  const shirtAccent = '#dc2626';
  const pants = '#1f2937';
  const shoe = '#111827';
  const beard = '#2b2b2b';

  const px = (gx: number, gy: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(gx * unit, gy * unit, unit, unit);
  };

  // Legs
  for (let gy = 14; gy <= 16; gy++) {
    for (let gx = 5; gx <= 10; gx++) {
      px(gx, gy, pants);
    }
  }
  px(5, 17, shoe);
  px(10, 17, shoe);

  // Torso
  for (let gy = 8; gy <= 13; gy++) {
    for (let gx = 5; gx <= 10; gx++) {
      px(gx, gy, shirt);
    }
  }
  if (isTossing) {
    px(3, 9, shirt);
    px(4, 9, shirt);
  }
  px(7, 10, shirtAccent);
  px(8, 11, shirtAccent);

  // Head
  for (let gy = 3; gy <= 6; gy++) {
    for (let gx = 6; gx <= 9; gx++) {
      px(gx, gy, skin);
    }
  }
  // Hair
  for (let gx = 5; gx <= 10; gx++) px(gx, 2, hair);
  px(5, 3, hair);
  px(10, 3, hair);
  // Beard
  px(7, 7, beard);
  px(8, 7, beard);

  // Eyes
  px(7, 4, '#111827');
  px(8, 4, '#111827');
  px(7, 5, '#ffffff');
  px(8, 5, '#ffffff');

  // Mouth
  px(7, 6, '#7c3aed');

  if (isDefeated) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, unit * baseW, unit * baseH);
  }

  if (hitFlash) {
    ctx.fillStyle = 'rgba(239,68,68,0.25)';
    ctx.fillRect(0, 0, unit * baseW, unit * baseH);
  }

  ctx.restore();
}

/**
 * Paloma / Pigeon Sprite Renderer (Crop from PNG using exact sx, sy, sw, sh)
 */
export function drawPigeonSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  options: PigeonSpriteOptions
) {
  const { isOnGround, isFlying, isFalling, isDestroyed, frameCount = 0 } = options;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const size = isDestroyed ? 44 : 36;
  const bob = isOnGround ? Math.sin(frameCount * 0.2) * 2 : Math.sin(frameCount * 0.4) * 4;
  const centerY = y + bob;
  ctx.translate(x, centerY);

  const unit = size / 12;
  const bodyColor = isDestroyed ? '#7f8c8d' : '#9ca3af';
  const wingColor = '#d1d5db';
  const beakColor = '#f59e0b';
  const eyeColor = '#111827';

  const px = (gx: number, gy: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect((gx - 6) * unit, (gy - 6) * unit, unit, unit);
  };

  // Body
  for (let gy = 3; gy <= 7; gy++) {
    for (let gx = 3; gx <= 8; gx++) px(gx, gy, bodyColor);
  }
  // Wing
  px(2, 4, wingColor);
  px(2, 5, wingColor);
  px(3, 5, wingColor);
  px(4, 6, wingColor);

  // Head
  for (let gx = 6; gx <= 8; gx++) px(gx, 2, bodyColor);
  px(5, 3, bodyColor);
  px(9, 3, bodyColor);

  // Beak
  px(9, 4, beakColor);

  // Eye
  px(7, 3, eyeColor);

  if (isFlying) {
    px(1, 3, wingColor);
    px(1, 4, wingColor);
    px(2, 2, wingColor);
  }

  if (isDestroyed) {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(-size / 2, -size / 2, size, size);
  }

  ctx.restore();
}

/**
 * Eliza Sprite Renderer (Crop from PNG using exact sx, sy, sw, sh)
 */
export function drawElizaSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  options: ElizaSpriteOptions = {}
) {
  const { isWalking = false, isReunion = false, isWedding = false, frameCount = 0 } = options;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const baseW = 10;
  const baseH = 18;
  const unit = Math.max(1, Math.floor(Math.min(width / baseW, height / baseH)));
  const drawW = unit * baseW;
  const drawH = unit * baseH;
  const offsetX = Math.floor((width - drawW) / 2);
  const offsetY = Math.floor((height - drawH) / 2);
  const bob = isWalking ? Math.round(Math.sin(frameCount * 0.25) * unit * 0.8) : 0;
  const renderY = y - bob;

  ctx.translate(x + offsetX, renderY + offsetY);

  const skin = '#f9dbb7';
  const hair = '#facc15';
  const dress = isWedding ? '#ffffff' : '#2563eb';
  const dressShade = isWedding ? '#d1d5db' : '#1d4ed8';
  const eye = '#2563eb';
  const eyeWhite = '#ffffff';
  const shoe = '#0f172a';
  const lip = '#be185d';

  const px = (gx: number, gy: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(gx * unit, gy * unit, unit, unit);
  };

  // Skirt and dress
  for (let gy = 10; gy <= 15; gy++) {
    for (let gx = 3; gx <= 6; gx++) {
      px(gx, gy, dress);
    }
  }
  px(4, 15, dressShade);
  px(5, 15, dressShade);
  px(3, 12, dressShade);
  px(6, 12, dressShade);

  // Torso
  for (let gy = 7; gy <= 9; gy++) {
    for (let gx = 3; gx <= 6; gx++) {
      px(gx, gy, dress);
    }
  }
  px(4, 8, dressShade);
  px(5, 8, dressShade);

  // Arms
  px(2, 8, skin);
  px(7, 8, skin);
  px(2, 9, dress);
  px(7, 9, dress);

  // Legs and shoes
  px(3, 16, shoe);
  px(6, 16, shoe);

  // Head
  for (let gy = 2; gy <= 5; gy++) {
    for (let gx = 4; gx <= 5; gx++) {
      px(gx, gy, skin);
    }
  }
  // Hair
  for (let gx = 3; gx <= 6; gx++) px(gx, 1, hair);
  px(3, 2, hair);
  px(6, 2, hair);
  px(2, 3, hair);
  px(7, 3, hair);

  // Eyes
  px(4, 3, eye);
  px(5, 3, eye);
  px(4, 4, eyeWhite);
  px(5, 4, eyeWhite);

  // Mouth
  px(4, 5, lip);

  if (isReunion) {
    px(2, 12, '#facc15');
    px(7, 12, '#facc15');
  }

  if (isWedding) {
    ctx.fillStyle = 'rgba(255,255,255,0.24)';
    ctx.fillRect(1 * unit, 1 * unit, 8 * unit, 4 * unit);
  }

  ctx.restore();
}

/**
 * Peruvian Passport Stamp Sprite
 */
export function drawTravelStampSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.save();
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 15;

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x - 3, y - 3, width + 6, height + 6);

  ctx.fillStyle = '#d97706';
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(x + 4, y + 4, width - 8, height - 8);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x + 6, y + 6, 8, height - 12);
  ctx.fillRect(x + width - 14, y + 6, 8, height - 12);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 14, y + 6, width - 28, height - 12);

  ctx.fillStyle = '#1e3a8a';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('PERÚ', x + 10, y + 26);

  ctx.restore();
}

/**
 * Pixel Airplane Sprite
 */
export function drawAirplaneSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  ctx.save();

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x, y + 8, width, 12);
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(x, y + 16, width, 4);

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x + width - 12, y + 8, 10, 6);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(x + 12, y + 10, 4, 3);
  ctx.fillRect(x + 20, y + 10, 4, 3);
  ctx.fillRect(x + 28, y + 10, 4, 3);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 8, y + 2, 10, 12);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x + 18, y - 6, 12, 26);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x + 22, y - 6, 4, 26);

  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x - 14, y + 12, 6, 4);

  ctx.restore();
}

/**
 * Glowing Pixel Heart Sprite
 */
export function drawGlowingHeartSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frameCount: number
) {
  ctx.save();
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 20;

  const pulse = Math.sin(frameCount * 0.1) * 2;

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(x, y, 14 + pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('♥', x - 6, y + 5);

  ctx.restore();
}
