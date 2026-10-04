// Utility to generate clean, high-resolution architectural SVG graphics for rooms and styles

export function getRetailerSearchUrl(retailer: string, query: string): string {
  const encoded = encodeURIComponent(query);
  switch (retailer) {
    case 'Urban Ladder':
      return `https://www.urbanladder.com/products/search?keywords=${encoded}`;
    case 'Pepperfry':
      return `https://www.pepperfry.com/site_product/search?q=${encoded}`;
    case 'IKEA India':
      return `https://www.ikea.com/in/en/search/?q=${encoded}`;
    case 'Amazon India':
      return `https://www.amazon.in/s?k=${encoded}&i=kitchen`;
    case 'West Elm':
      return `https://www.westelm.com/search/results.html?words=${encoded}`;
    case 'CB2':
      return `https://www.cb2.com/search?query=${encoded}`;
    case 'Wayfair':
      return `https://www.wayfair.com/keyword.php?keyword=${encoded}`;
    case 'IKEA':
      return `https://www.ikea.com/us/en/search/?q=${encoded}`;
    case 'Amazon Home':
      return `https://www.amazon.com/s?k=${encoded}&i=garden`;
    case 'Pottery Barn':
      return `https://www.potterybarn.com/search/results.html?words=${encoded}`;
    default:
      return `https://www.google.com/search?q=${encoded}+furniture`;
  }
}

// Generates an SVG data URL for a room visual
export function createRoomSvgDataUrl(
  type: 'original' | 'mid-century' | 'scandinavian' | 'industrial' | 'biophilic' | 'art-deco' | 'coastal',
  roomType: string = 'living',
  customOptions?: { rugColor?: string; wallColor?: string; timeOfDay?: 'daylight' | 'golden' | 'evening' }
): string {
  const width = 1280;
  const height = 720;

  const timeOfDay = customOptions?.timeOfDay || 'daylight';
  const customRug = customOptions?.rugColor;
  const customWall = customOptions?.wallColor;

  // Lighting overlay
  let skyGradient = `<stop offset="0%" stop-color="#bae6fd"/><stop offset="100%" stop-color="#f8fafc"/>`;
  let ambientTint = `rgba(255,255,255,0)`;
  if (timeOfDay === 'golden') {
    skyGradient = `<stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#fdba74"/>`;
    ambientTint = `rgba(251, 146, 60, 0.12)`;
  } else if (timeOfDay === 'evening') {
    skyGradient = `<stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#312e81"/>`;
    ambientTint = `rgba(15, 23, 42, 0.35)`;
  }

  // Base Room Geometry (Perspective 3D room box)
  let content = '';

  if (type === 'original') {
    // Empty, slightly unstyled bare room awaiting makeover
    const wallColor = customWall || '#e2d9cf';
    const floorColor = '#c4a482';
    content = `
      <defs>
        <linearGradient id="wallBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${wallColor}" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="${wallColor}"/>
        </linearGradient>
        <linearGradient id="wallLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#cfc4b6"/>
          <stop offset="100%" stop-color="${wallColor}"/>
        </linearGradient>
        <linearGradient id="wallRight" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#cfc4b6"/>
          <stop offset="100%" stop-color="${wallColor}"/>
        </linearGradient>
        <linearGradient id="parquetFloor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#b8936f"/>
          <stop offset="100%" stop-color="${floorColor}"/>
        </linearGradient>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">${skyGradient}</linearGradient>
      </defs>

      <!-- Ceiling -->
      <polygon points="0,0 1280,0 1060,140 220,140" fill="#f5f2ed" />
      
      <!-- Back Wall -->
      <polygon points="220,140 1060,140 1060,540 220,540" fill="url(#wallBack)" />

      <!-- Left Wall -->
      <polygon points="0,0 220,140 220,540 0,720" fill="url(#wallLeft)" />

      <!-- Right Wall -->
      <polygon points="1280,0 1060,140 1060,540 1280,720" fill="url(#wallRight)" />

      <!-- Floor -->
      <polygon points="220,540 1060,540 1280,720 0,720" fill="url(#parquetFloor)" />

      <!-- Hardwood Floor Planks lines -->
      <path d="M 220,540 L 0,720 M 360,540 L 210,720 M 500,540 L 420,720 M 640,540 L 640,720 M 780,540 L 860,720 M 920,540 L 1070,720 M 1060,540 L 1280,720" stroke="#a37e58" stroke-width="2" opacity="0.45" />

      <!-- Baseboards -->
      <polygon points="220,534 1060,534 1060,540 220,540" fill="#d9d0c5" />
      <polygon points="0,712 220,534 220,540 0,720" fill="#c7beb3" />
      <polygon points="1280,712 1060,534 1060,540 1280,720" fill="#c7beb3" />

      <!-- Back Window with Outside View -->
      <rect x="340" y="190" width="600" height="280" rx="4" fill="url(#skyGrad)" stroke="#52525b" stroke-width="12" />
      <rect x="340" y="190" width="600" height="280" rx="4" fill="none" stroke="#27272a" stroke-width="4" />
      <!-- Window mullions -->
      <line x1="640" y1="190" x2="640" y2="470" stroke="#3f3f46" stroke-width="8" />
      <line x1="340" y1="330" x2="940" y2="330" stroke="#3f3f46" stroke-width="8" />
      
      <!-- Window Sunlight casting on floor -->
      <polygon points="340,470 940,470 1080,680 400,680" fill="#ffffff" opacity="0.14" />

      <!-- Single bare wire bulb hanging from ceiling (unrenovated feel) -->
      <line x1="640" y1="140" x2="640" y2="230" stroke="#18181b" stroke-width="2" />
      <circle cx="640" cy="236" r="8" fill="#fef08a" opacity="0.8" />
      <circle cx="640" cy="236" r="16" fill="#fef08a" opacity="0.2" />

      <!-- Empty Moving Box / Unstyled Corner -->
      <polygon points="260,510 320,510 340,540 280,540" fill="#b49372" opacity="0.9" />
      <polygon points="260,510 280,540 280,570 260,538" fill="#9d7e5d" opacity="0.9" />
      <polygon points="320,510 340,540 340,570 320,538" fill="#886b4d" opacity="0.9" />

      <!-- Subtitle badge on visual -->
      <g transform="translate(48, 48)">
        <rect width="210" height="38" rx="6" fill="rgba(15, 23, 42, 0.75)" backdrop-filter="blur(8px)" />
        <circle cx="20" cy="19" r="5" fill="#f97316" />
        <text x="36" y="24" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="0.5">CURRENT SPACE</text>
      </g>
    `;
  } else if (type === 'mid-century') {
    // Rich walnut, brass sputnik, caramel lounge chair, olive velvet sofa, geometric rug
    const rugFill = customRug || '#d97706';
    const wallAccent = customWall || '#2b3a32';
    content = `
      <defs>
        <linearGradient id="mcWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fdf8f0"/>
          <stop offset="100%" stop-color="#f5ede0"/>
        </linearGradient>
        <linearGradient id="walnutSlat" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4a2c16"/>
          <stop offset="100%" stop-color="#361f0e"/>
        </linearGradient>
        <linearGradient id="caramelLeather" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#c97a3a"/>
          <stop offset="100%" stop-color="#9a521e"/>
        </linearGradient>
        <linearGradient id="oliveVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#556947"/>
          <stop offset="100%" stop-color="#3d4c32"/>
        </linearGradient>
      </defs>

      <!-- Ceiling -->
      <polygon points="0,0 1280,0 1060,130 220,130" fill="#faf6f0" />
      
      <!-- Back Wall (White with subtle warmth) -->
      <polygon points="220,130 1060,130 1060,540 220,540" fill="url(#mcWall)" />

      <!-- Left Wall: Walnut Wood Slat Feature Wall -->
      <polygon points="0,0 220,130 220,540 0,720" fill="url(#walnutSlat)" />
      <!-- Vertical slat lines -->
      <path d="M 25,15 L 25,690 M 50,30 L 50,660 M 75,45 L 75,630 M 100,60 L 100,600 M 125,75 L 125,580 M 150,90 L 150,565 M 175,105 L 175,550 M 200,120 L 200,545" stroke="#241407" stroke-width="5" />

      <!-- Right Wall (Soft Sage or Custom Wall) -->
      <polygon points="1280,0 1060,130 1060,540 1280,720" fill="${wallAccent}" opacity="0.9" />

      <!-- Deep Walnut Parquet Floor -->
      <polygon points="220,540 1060,540 1280,720 0,720" fill="#5c381e" />
      <path d="M 220,540 L 0,720 M 360,540 L 210,720 M 500,540 L 420,720 M 640,540 L 640,720 M 780,540 L 860,720 M 920,540 L 1070,720 M 1060,540 L 1280,720" stroke="#3d220e" stroke-width="3" opacity="0.6" />

      <!-- High Architectural Window on Back Wall -->
      <rect x="360" y="160" width="460" height="230" rx="4" fill="#dbeafe" stroke="#1c1917" stroke-width="8" />
      <line x1="590" y1="160" x2="590" y2="390" stroke="#1c1917" stroke-width="6" />
      <line x1="360" y1="275" x2="820" y2="275" stroke="#1c1917" stroke-width="6" />
      
      <!-- Modern Mid-Century Geometric Abstract Art on Back Wall -->
      <g transform="translate(860, 180)">
        <rect width="160" height="210" rx="3" fill="#faf6ed" stroke="#1c1917" stroke-width="6" />
        <circle cx="80" cy="80" r="45" fill="#c25e2e" />
        <polygon points="40,160 120,160 80,100" fill="#1e3a5f" />
        <line x1="30" y1="180" x2="130" y2="180" stroke="#d97706" stroke-width="6" />
      </g>

      <!-- Large Geometric Wool Rug -->
      <polygon points="360,555 960,555 1100,695 240,695" fill="${rugFill}" rx="12" />
      <!-- Geometric Diamond Pattern on Rug -->
      <path d="M 400,625 L 660,570 L 920,625 L 660,680 Z M 480,625 L 660,585 L 840,625 L 660,665 Z" fill="none" stroke="#faf6ed" stroke-width="4" opacity="0.65" />

      <!-- Olive Velvet Low-Profile Sectional Sofa -->
      <g transform="translate(380, 440)">
        <!-- Backrest -->
        <rect x="0" y="0" width="480" height="70" rx="14" fill="url(#oliveVelvet)" />
        <!-- Seat cushions -->
        <rect x="10" y="45" width="225" height="55" rx="10" fill="#4d5f3f" />
        <rect x="245" y="45" width="225" height="55" rx="10" fill="#4d5f3f" />
        <!-- Throw Pillows (Ochre & Terracotta) -->
        <polygon points="30,35 70,35 60,65 20,65" fill="#d97706" rx="4" />
        <polygon points="420,35 460,35 450,65 410,65" fill="#b45309" rx="4" />
        <!-- Tapered Brass Legs -->
        <line x1="30" y1="95" x2="15" y2="130" stroke="#ca8a04" stroke-width="6" stroke-linecap="round" />
        <line x1="450" y1="95" x2="465" y2="130" stroke="#ca8a04" stroke-width="6" stroke-linecap="round" />
        <line x1="240" y1="95" x2="240" y2="130" stroke="#ca8a04" stroke-width="6" stroke-linecap="round" />
      </g>

      <!-- Mid-Century Oval Walnut Coffee Table -->
      <g transform="translate(510, 565)">
        <ellipse cx="140" cy="25" rx="140" ry="32" fill="#3b2110" stroke="#251408" stroke-width="3" />
        <line x1="50" y1="35" x2="40" y2="65" stroke="#ca8a04" stroke-width="5" stroke-linecap="round" />
        <line x1="230" y1="35" x2="240" y2="65" stroke="#ca8a04" stroke-width="5" stroke-linecap="round" />
        <line x1="140" y1="42" x2="140" y2="68" stroke="#ca8a04" stroke-width="5" stroke-linecap="round" />
        <!-- Art Books on Table -->
        <rect x="110" y="16" width="36" height="24" rx="2" fill="#faf5ef" stroke="#475569" stroke-width="1.5" />
        <!-- Ceramic Vase -->
        <path d="M 165,12 Q 172,25 168,32 L 160,32 Q 156,25 163,12 Z" fill="#e07a5f" />
      </g>

      <!-- Iconic Eames-Style Caramel Leather Lounge Chair & Ottoman -->
      <g transform="translate(930, 480)">
        <!-- Chair Molded Plywood Shell & Leather -->
        <rect x="20" y="20" width="105" height="90" rx="20" fill="url(#caramelLeather)" stroke="#2b170c" stroke-width="4" />
        <rect x="35" y="0" width="75" height="40" rx="14" fill="url(#caramelLeather)" />
        <line x1="72" y1="110" x2="72" y2="140" stroke="#1c1917" stroke-width="7" />
        <line x1="40" y1="140" x2="105" y2="140" stroke="#1c1917" stroke-width="5" />
        <!-- Ottoman -->
        <rect x="0" y="125" width="70" height="35" rx="8" fill="url(#caramelLeather)" />
        <line x1="35" y1="160" x2="35" y2="175" stroke="#1c1917" stroke-width="4" />
      </g>

      <!-- Brass Sputnik Chandelier from Ceiling -->
      <g transform="translate(640, 110)">
        <line x1="0" y1="0" x2="0" y2="70" stroke="#ca8a04" stroke-width="4" />
        <circle cx="0" cy="70" r="14" fill="#eab308" />
        <!-- Starburst brass arms with glowing globes -->
        <line x1="0" y1="70" x2="-45" y2="40" stroke="#ca8a04" stroke-width="3" />
        <circle cx="-45" cy="40" r="8" fill="#fef08a" />
        <line x1="0" y1="70" x2="45" y2="40" stroke="#ca8a04" stroke-width="3" />
        <circle cx="45" cy="40" r="8" fill="#fef08a" />
        <line x1="0" y1="70" x2="-55" y2="90" stroke="#ca8a04" stroke-width="3" />
        <circle cx="-55" cy="90" r="8" fill="#fef08a" />
        <line x1="0" y1="70" x2="55" y2="90" stroke="#ca8a04" stroke-width="3" />
        <circle cx="55" cy="90" r="8" fill="#fef08a" />
        <line x1="0" y1="70" x2="0" y2="115" stroke="#ca8a04" stroke-width="3" />
        <circle cx="0" cy="115" r="9" fill="#fef08a" />
      </g>

      <!-- Large Fiddle Leaf Fig in Ceramic Planter on Left -->
      <g transform="translate(240, 390)">
        <polygon points="35,140 75,140 85,210 25,210" fill="#f8fafc" stroke="#e2e8f0" stroke-width="3" />
        <!-- Plant trunk & leaves -->
        <line x1="55" y1="140" x2="55" y2="30" stroke="#47321e" stroke-width="7" stroke-linecap="round" />
        <ellipse cx="30" cy="50" rx="35" ry="22" fill="#2d6a4f" transform="rotate(-25 30 50)" />
        <ellipse cx="80" cy="40" rx="40" ry="25" fill="#40916c" transform="rotate(20 80 40)" />
        <ellipse cx="35" cy="90" rx="38" ry="24" fill="#1b4332" transform="rotate(-15 35 90)" />
        <ellipse cx="75" cy="95" rx="36" ry="22" fill="#2d6a4f" transform="rotate(30 75 95)" />
      </g>

      <!-- Style badge -->
      <g transform="translate(48, 48)">
        <rect width="250" height="38" rx="6" fill="rgba(15, 23, 42, 0.85)" backdrop-filter="blur(8px)" />
        <circle cx="20" cy="19" r="5" fill="#ca8a04" />
        <text x="36" y="24" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="0.5">MID-CENTURY MODERN</text>
      </g>
    `;
  } else if (type === 'scandinavian') {
    // Light blonde oak, cream bouclé curved sectional, fluted round coffee table, ivory ribbed rug, sage cushions
    const rugFill = customRug || '#f4efe6';
    const wallColor = customWall || '#f8f6f0';
    content = `
      <defs>
        <linearGradient id="scandWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${wallColor}"/>
          <stop offset="100%" stop-color="#ece7dc"/>
        </linearGradient>
        <linearGradient id="scandFloor" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e3d6c1"/>
          <stop offset="100%" stop-color="#cbba9f"/>
        </linearGradient>
        <linearGradient id="boucleCream" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#ede8dd"/>
        </linearGradient>
      </defs>

      <!-- Ceiling -->
      <polygon points="0,0 1280,0 1060,130 220,130" fill="#fcfbf9" />
      
      <!-- Back Wall -->
      <polygon points="220,130 1060,130 1060,540 220,540" fill="url(#scandWall)" />

      <!-- Left Wall with Pale Oak Shelving -->
      <polygon points="0,0 220,130 220,540 0,720" fill="#ede6db" />
      <line x1="30" y1="260" x2="200" y2="260" stroke="#cbb89d" stroke-width="8" stroke-linecap="round" />
      <line x1="50" y1="360" x2="210" y2="360" stroke="#cbb89d" stroke-width="8" stroke-linecap="round" />
      <!-- Minimalist ceramics on shelf -->
      <circle cx="80" cy="245" r="14" fill="#faf6f0" stroke="#d5c8b5" stroke-width="2" />
      <rect x="130" y="235" width="22" height="25" rx="3" fill="#849683" />

      <!-- Right Wall with Archway Alcove -->
      <polygon points="1280,0 1060,130 1060,540 1280,720" fill="#f0ebe1" />

      <!-- Pale White Oak Floor -->
      <polygon points="220,540 1060,540 1280,720 0,720" fill="url(#scandFloor)" />
      <path d="M 220,540 L 0,720 M 360,540 L 210,720 M 500,540 L 420,720 M 640,540 L 640,720 M 780,540 L 860,720 M 920,540 L 1070,720 M 1060,540 L 1280,720" stroke="#bda889" stroke-width="2" opacity="0.4" />

      <!-- Huge Panoramic Minimalist Window -->
      <rect x="360" y="160" width="560" height="260" rx="6" fill="#e0f2fe" stroke="#d4c9b8" stroke-width="10" />
      <line x1="640" y1="160" x2="640" y2="420" stroke="#d4c9b8" stroke-width="6" />
      <!-- Sheer Linen Curtains framing window -->
      <rect x="330" y="145" width="45" height="380" fill="#ffffff" opacity="0.75" />
      <rect x="905" y="145" width="45" height="380" fill="#ffffff" opacity="0.75" />

      <!-- Textural High-Pile Cream Ribbed Wool Rug -->
      <polygon points="340,555 980,555 1130,698 210,698" fill="${rugFill}" rx="14" stroke="#e2ded4" stroke-width="2" />
      <!-- Ribbed woven lines -->
      <path d="M 270,685 L 1080,685 M 290,660 L 1050,660 M 310,635 L 1020,635 M 330,610 L 990,610 M 350,585 L 970,585" stroke="#ddd6c8" stroke-width="3" stroke-dasharray="8 6" />

      <!-- Organic Curved Cream Bouclé Sectional Sofa -->
      <g transform="translate(360, 430)">
        <path d="M 40,40 Q 240,0 520,30 Q 560,50 550,110 Q 520,130 460,120 Q 260,110 50,130 Q 15,100 40,40 Z" fill="url(#boucleCream)" stroke="#e4ded3" stroke-width="3" />
        <!-- Sage Linen Throw Cushions -->
        <rect x="90" y="45" width="55" height="48" rx="8" fill="#849683" transform="rotate(-8 90 45)" />
        <rect x="390" y="48" width="55" height="48" rx="8" fill="#b09b85" transform="rotate(12 390 48)" />
      </g>

      <!-- Fluted Round Blonde Oak Coffee Table -->
      <g transform="translate(620, 560)">
        <ellipse cx="60" cy="20" rx="65" ry="24" fill="#dfd0ba" stroke="#c8b79f" stroke-width="3" />
        <!-- Fluted cylinder base -->
        <rect x="25" y="24" width="70" height="38" rx="4" fill="#cbb79d" />
        <line x1="35" y1="24" x2="35" y2="62" stroke="#b09b80" stroke-width="3" />
        <line x1="45" y1="24" x2="45" y2="62" stroke="#b09b80" stroke-width="3" />
        <line x1="55" y1="24" x2="55" y2="62" stroke="#b09b80" stroke-width="3" />
        <line x1="65" y1="24" x2="65" y2="62" stroke="#b09b80" stroke-width="3" />
        <line x1="75" y1="24" x2="75" y2="62" stroke="#b09b80" stroke-width="3" />
        <line x1="85" y1="24" x2="85" y2="62" stroke="#b09b80" stroke-width="3" />
        <!-- Ceramic bowl on table -->
        <ellipse cx="60" cy="18" rx="16" ry="8" fill="#faf9f6" stroke="#cbb89e" stroke-width="1.5" />
      </g>

      <!-- Japanese Paper Noguchi Style Pendant Lamp -->
      <g transform="translate(640, 110)">
        <line x1="0" y1="0" x2="0" y2="90" stroke="#262626" stroke-width="2" />
        <ellipse cx="0" cy="115" rx="48" ry="32" fill="#fffdfa" stroke="#e8e2d5" stroke-width="2" />
        <ellipse cx="0" cy="115" rx="36" ry="24" fill="#fffdfa" opacity="0.9" />
        <circle cx="0" cy="115" r="16" fill="#fef08a" opacity="0.45" />
      </g>

      <!-- Minimalist Olive Tree in Terracotta Urn on Right -->
      <g transform="translate(980, 420)">
        <polygon points="30,120 70,120 78,190 22,190" fill="#e7c8b0" stroke="#d4ab8f" stroke-width="2" />
        <line x1="50" y1="120" x2="50" y2="30" stroke="#635140" stroke-width="5" stroke-linecap="round" />
        <circle cx="35" cy="50" r="22" fill="#758a74" opacity="0.85" />
        <circle cx="65" cy="40" r="25" fill="#586e57" opacity="0.85" />
        <circle cx="50" cy="80" r="28" fill="#687f67" opacity="0.85" />
      </g>

      <!-- Style badge -->
      <g transform="translate(48, 48)">
        <rect width="250" height="38" rx="6" fill="rgba(15, 23, 42, 0.85)" backdrop-filter="blur(8px)" />
        <circle cx="20" cy="19" r="5" fill="#849683" />
        <text x="36" y="24" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="0.5">JAPANDI SCANDINAVIAN</text>
      </g>
    `;
  } else if (type === 'industrial') {
    // Exposed brick wall, blackened steel, cognac chesterfield leather, reclaimed timber
    const rugFill = customRug || '#262626';
    const wallColor = customWall || '#b95d46';
    content = `
      <defs>
        <pattern id="brickPattern" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="${wallColor}" />
          <line x1="0" y1="10" x2="40" y2="10" stroke="#873e2b" stroke-width="2" />
          <line x1="0" y1="20" x2="40" y2="20" stroke="#873e2b" stroke-width="2" />
          <line x1="20" y1="0" x2="20" y2="10" stroke="#873e2b" stroke-width="2" />
          <line x1="40" y1="10" x2="40" y2="20" stroke="#873e2b" stroke-width="2" />
        </pattern>
        <linearGradient id="cognacLeather" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
      </defs>

      <!-- Ceiling (Industrial Concrete & Exposed Pipes) -->
      <polygon points="0,0 1280,0 1060,130 220,130" fill="#3f3f46" />
      <line x1="40" y1="40" x2="1180" y2="40" stroke="#27272a" stroke-width="12" />
      <line x1="120" y1="80" x2="1100" y2="80" stroke="#52525b" stroke-width="8" />

      <!-- Back Wall: Exposed Heritage Brick -->
      <polygon points="220,130 1060,130 1060,540 220,540" fill="url(#brickPattern)" />

      <!-- Left Wall: Matte Black Steel & Charcoal -->
      <polygon points="0,0 220,130 220,540 0,720" fill="#18181b" />

      <!-- Right Wall: Charcoal Plaster -->
      <polygon points="1280,0 1060,130 1060,540 1280,720" fill="#27272a" />

      <!-- Polished Concrete Floor -->
      <polygon points="220,540 1060,540 1280,720 0,720" fill="#52525b" />
      <polygon points="400,540 880,540 1020,720 300,720" fill="#71717a" opacity="0.3" />

      <!-- Crittall-Style Black Steel Factory Windows -->
      <rect x="360" y="160" width="560" height="250" fill="#09090b" stroke="#18181b" stroke-width="10" />
      <!-- Grid -->
      <line x1="472" y1="160" x2="472" y2="410" stroke="#27272a" stroke-width="4" />
      <line x1="584" y1="160" x2="584" y2="410" stroke="#27272a" stroke-width="4" />
      <line x1="696" y1="160" x2="696" y2="410" stroke="#27272a" stroke-width="4" />
      <line x1="808" y1="160" x2="808" y2="410" stroke="#27272a" stroke-width="4" />
      <line x1="360" y1="240" x2="920" y2="240" stroke="#27272a" stroke-width="4" />
      <line x1="360" y1="320" x2="920" y2="320" stroke="#27272a" stroke-width="4" />

      <!-- Distressed Charcoal / Vintage Anatolian Rug -->
      <polygon points="340,555 980,555 1120,698 220,698" fill="${rugFill}" rx="8" stroke="#404040" stroke-width="2" />
      <path d="M 400,625 L 940,625 M 480,590 L 860,590 M 480,660 L 860,660" stroke="#737373" stroke-width="2" stroke-dasharray="10 8" />

      <!-- Tufted Cognac Leather Chesterfield Sofa -->
      <g transform="translate(380, 440)">
        <rect x="0" y="0" width="480" height="85" rx="20" fill="url(#cognacLeather)" stroke="#451a03" stroke-width="4" />
        <!-- Scroll arms -->
        <circle cx="15" cy="40" r="22" fill="#78350f" stroke="#451a03" stroke-width="3" />
        <circle cx="465" cy="40" r="22" fill="#78350f" stroke="#451a03" stroke-width="3" />
        <!-- Tufting buttons -->
        <circle cx="120" cy="35" r="4" fill="#451a03" />
        <circle cx="240" cy="35" r="4" fill="#451a03" />
        <circle cx="360" cy="35" r="4" fill="#451a03" />
        <circle cx="180" cy="60" r="4" fill="#451a03" />
        <circle cx="300" cy="60" r="4" fill="#451a03" />
      </g>

      <!-- Reclaimed Timber & Black Iron Coffee Table -->
      <g transform="translate(520, 565)">
        <rect x="0" y="0" width="240" height="28" rx="3" fill="#854d0e" stroke="#18181b" stroke-width="3" />
        <line x1="20" y1="28" x2="20" y2="58" stroke="#18181b" stroke-width="6" />
        <line x1="220" y1="28" x2="220" y2="58" stroke="#18181b" stroke-width="6" />
        <line x1="20" y1="52" x2="220" y2="52" stroke="#18181b" stroke-width="4" />
      </g>

      <!-- Oversized Black Metal Arc Floor Lamp -->
      <g transform="translate(240, 260)">
        <path d="M 40,360 Q 40,60 220,120" fill="none" stroke="#18181b" stroke-width="6" />
        <path d="M 200,110 Q 235,100 245,135 Z" fill="#27272a" stroke="#18181b" stroke-width="2" />
        <circle cx="230" cy="138" r="10" fill="#fef08a" opacity="0.8" />
        <line x1="20" y1="360" x2="60" y2="360" stroke="#18181b" stroke-width="10" stroke-linecap="round" />
      </g>

      <!-- Style badge -->
      <g transform="translate(48, 48)">
        <rect width="250" height="38" rx="6" fill="rgba(15, 23, 42, 0.85)" backdrop-filter="blur(8px)" />
        <circle cx="20" cy="19" r="5" fill="#f97316" />
        <text x="36" y="24" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="0.5">INDUSTRIAL MODERN LOFT</text>
      </g>
    `;
  } else if (type === 'biophilic') {
    // Living botanical green wall, rattan lounge chairs, curved travertine table, natural light
    const rugFill = customRug || '#c29a67';
    const wallColor = customWall || '#f4f0e8';
    content = `
      <defs>
        <linearGradient id="bioWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${wallColor}"/>
          <stop offset="100%" stop-color="#e6dfd1"/>
        </linearGradient>
        <linearGradient id="greenWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#14532d"/>
          <stop offset="50%" stop-color="#166534"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
      </defs>

      <!-- Ceiling -->
      <polygon points="0,0 1280,0 1060,130 220,130" fill="#fcfaf6" />

      <!-- Back Wall -->
      <polygon points="220,130 1060,130 1060,540 220,540" fill="url(#bioWall)" />

      <!-- Left Wall: Floor-to-Ceiling Living Botanical Green Wall -->
      <polygon points="0,0 220,130 220,540 0,720" fill="url(#greenWall)" />
      <!-- Cascading plant leaves textures on green wall -->
      <g fill="#22c55e" opacity="0.35">
        <circle cx="40" cy="140" r="16" /> <circle cx="90" cy="120" r="22" /> <circle cx="150" cy="180" r="24" />
        <circle cx="60" cy="280" r="26" /> <circle cx="120" cy="240" r="20" /> <circle cx="170" cy="320" r="28" />
        <circle cx="50" cy="440" r="30" /> <circle cx="130" cy="400" r="25" /> <circle cx="180" cy="490" r="32" />
        <circle cx="80" cy="580" r="35" /> <circle cx="140" cy="540" r="28" />
      </g>

      <!-- Right Wall with bamboo slat screen -->
      <polygon points="1280,0 1060,130 1060,540 1280,720" fill="#ebe4d5" />

      <!-- Natural Light Ash Flooring -->
      <polygon points="220,540 1060,540 1280,720 0,720" fill="#cfc2ab" />
      <path d="M 220,540 L 0,720 M 360,540 L 210,720 M 500,540 L 420,720 M 640,540 L 640,720 M 780,540 L 860,720 M 920,540 L 1070,720 M 1060,540 L 1280,720" stroke="#b8a88d" stroke-width="2" opacity="0.4" />

      <!-- Sun-drenched floor to ceiling glass door -->
      <rect x="360" y="150" width="540" height="280" rx="4" fill="#ecfeff" stroke="#a89a84" stroke-width="8" />
      <line x1="630" y1="150" x2="630" y2="430" stroke="#a89a84" stroke-width="6" />

      <!-- Braided Natural Jute Round Area Rug -->
      <ellipse cx="640" cy="625" rx="380" ry="85" fill="${rugFill}" stroke="#a87f4c" stroke-width="4" stroke-dasharray="12 6" />

      <!-- Ivory Organic Linen Low Sofa -->
      <g transform="translate(380, 440)">
        <rect x="0" y="0" width="460" height="85" rx="16" fill="#fdfbf7" stroke="#e0d6c5" stroke-width="3" />
        <!-- Terracotta and Forest Green Pillows -->
        <rect x="40" y="30" width="50" height="42" rx="6" fill="#c25e2e" />
        <rect x="370" y="30" width="50" height="42" rx="6" fill="#1b4332" />
      </g>

      <!-- Sculptural Travertine Stone Coffee Table -->
      <g transform="translate(540, 560)">
        <ellipse cx="90" cy="22" rx="90" ry="28" fill="#f5efe6" stroke="#ded4c3" stroke-width="3" />
        <!-- Plinth legs -->
        <polygon points="30,22 55,22 55,60 30,60" fill="#e8dcce" />
        <polygon points="125,22 150,22 150,60 125,60" fill="#e8dcce" />
        <!-- Small succulent planter -->
        <circle cx="90" cy="20" r="10" fill="#15803d" />
      </g>

      <!-- Rattan / Woven Cane Armchair on Right -->
      <g transform="translate(920, 480)">
        <path d="M 20,40 Q 80,0 120,40 L 110,110 L 20,110 Z" fill="#d97706" opacity="0.3" stroke="#b45309" stroke-width="4" />
        <rect x="30" y="60" width="80" height="30" rx="8" fill="#fffdfa" />
        <line x1="30" y1="110" x2="20" y2="150" stroke="#78350f" stroke-width="5" />
        <line x1="110" y1="110" x2="120" y2="150" stroke="#78350f" stroke-width="5" />
      </g>

      <!-- Style badge -->
      <g transform="translate(48, 48)">
        <rect width="250" height="38" rx="6" fill="rgba(15, 23, 42, 0.85)" backdrop-filter="blur(8px)" />
        <circle cx="20" cy="19" r="5" fill="#16a34a" />
        <text x="36" y="24" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="0.5">BIOPHILIC SANCTUARY</text>
      </g>
    `;
  } else if (type === 'art-deco') {
    // Emerald velvet, champagne brass, geometric marble, midnight accents
    const rugFill = customRug || '#0f172a';
    const wallColor = customWall || '#132a26';
    content = `
      <defs>
        <linearGradient id="artDecoWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${wallColor}"/>
          <stop offset="100%" stop-color="#0a1a17"/>
        </linearGradient>
      </defs>

      <!-- Ceiling -->
      <polygon points="0,0 1280,0 1060,130 220,130" fill="#0f172a" />
      
      <!-- Back Wall with Brass Molding Panels -->
      <polygon points="220,130 1060,130 1060,540 220,540" fill="url(#artDecoWall)" />
      <!-- Geometric brass molding -->
      <rect x="300" y="160" width="180" height="320" fill="none" stroke="#d4af37" stroke-width="3" />
      <rect x="315" y="175" width="150" height="290" fill="none" stroke="#d4af37" stroke-width="1.5" />
      <rect x="800" y="160" width="180" height="320" fill="none" stroke="#d4af37" stroke-width="3" />
      <rect x="815" y="175" width="150" height="290" fill="none" stroke="#d4af37" stroke-width="1.5" />

      <!-- Left Wall & Right Wall -->
      <polygon points="0,0 220,130 220,540 0,720" fill="#081412" />
      <polygon points="1280,0 1060,130 1060,540 1280,720" fill="#081412" />

      <!-- Glossy Black Herringbone Marble Floor -->
      <polygon points="220,540 1060,540 1280,720 0,720" fill="#111827" />
      <path d="M 220,540 L 0,720 M 640,540 L 640,720 M 1060,540 L 1280,720" stroke="#d4af37" stroke-width="1.5" opacity="0.3" />

      <!-- Central Arch Mirror with Sunburst -->
      <g transform="translate(540, 160)">
        <path d="M 0,160 L 0,80 A 100,100 0 0,1 200,80 L 200,160 Z" fill="#38bdf8" opacity="0.4" stroke="#d4af37" stroke-width="4" />
      </g>

      <!-- Geometric Midnight Navy & Gold Rug -->
      <polygon points="340,555 980,555 1120,698 220,698" fill="${rugFill}" rx="8" stroke="#d4af37" stroke-width="3" />

      <!-- Curved Emerald Velvet Fluted Sofa -->
      <g transform="translate(380, 440)">
        <rect x="0" y="0" width="480" height="85" rx="20" fill="#064e3b" stroke="#d4af37" stroke-width="3" />
        <!-- Fluted channeling lines -->
        <line x1="80" y1="0" x2="80" y2="85" stroke="#022c22" stroke-width="3" />
        <line x1="160" y1="0" x2="160" y2="85" stroke="#022c22" stroke-width="3" />
        <line x1="240" y1="0" x2="240" y2="85" stroke="#022c22" stroke-width="3" />
        <line x1="320" y1="0" x2="320" y2="85" stroke="#022c22" stroke-width="3" />
        <line x1="400" y1="0" x2="400" y2="85" stroke="#022c22" stroke-width="3" />
      </g>

      <!-- Calacatta Gold Marble & Brass Coffee Table -->
      <g transform="translate(520, 565)">
        <rect x="0" y="0" width="240" height="26" rx="4" fill="#fafafa" stroke="#d4af37" stroke-width="4" />
        <line x1="30" y1="26" x2="30" y2="58" stroke="#d4af37" stroke-width="6" />
        <line x1="210" y1="26" x2="210" y2="58" stroke="#d4af37" stroke-width="6" />
      </g>

      <!-- Cascading Crystal Globe Chandelier -->
      <g transform="translate(640, 110)">
        <line x1="0" y1="0" x2="0" y2="60" stroke="#d4af37" stroke-width="4" />
        <circle cx="-30" cy="75" r="14" fill="#fef08a" opacity="0.9" />
        <circle cx="30" cy="75" r="14" fill="#fef08a" opacity="0.9" />
        <circle cx="0" cy="95" r="18" fill="#fef08a" opacity="0.95" />
      </g>

      <!-- Style badge -->
      <g transform="translate(48, 48)">
        <rect width="250" height="38" rx="6" fill="rgba(15, 23, 42, 0.85)" backdrop-filter="blur(8px)" />
        <circle cx="20" cy="19" r="5" fill="#d4af37" />
        <text x="36" y="24" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="0.5">ART DECO CONTEMPORARY</text>
      </g>
    `;
  } else {
    // Coastal Mediterranean: Whitewash, terracotta urns, cerulean ocean blue accents, sun-bleached driftwood
    const rugFill = customRug || '#e2e8f0';
    const wallColor = customWall || '#fafaf9';
    content = `
      <defs>
        <linearGradient id="coastWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${wallColor}"/>
          <stop offset="100%" stop-color="#f5f5f4"/>
        </linearGradient>
      </defs>

      <!-- Ceiling -->
      <polygon points="0,0 1280,0 1060,130 220,130" fill="#ffffff" />
      <!-- Bleached timber beams -->
      <line x1="220" y1="130" x2="0" y2="0" stroke="#d6d3d1" stroke-width="12" />
      <line x1="1060" y1="130" x2="1280" y2="0" stroke="#d6d3d1" stroke-width="12" />

      <!-- Back Wall (Lime Plaster Whitewash) -->
      <polygon points="220,130 1060,130 1060,540 220,540" fill="url(#coastWall)" />

      <!-- Left & Right Walls with sculpted plaster niches -->
      <polygon points="0,0 220,130 220,540 0,720" fill="#f5f5f4" />
      <polygon points="1280,0 1060,130 1060,540 1280,720" fill="#f5f5f4" />

      <!-- Sun-Bleached Sand Limestone Floor -->
      <polygon points="220,540 1060,540 1280,720 0,720" fill="#e7e5e4" />

      <!-- Mediterranean Arched Window opening to Azure Sea -->
      <g transform="translate(460, 160)">
        <path d="M 0,260 L 0,100 A 180,180 0 0,1 360,100 L 360,260 Z" fill="#38bdf8" stroke="#ffffff" stroke-width="10" />
        <!-- Sea horizon -->
        <rect x="0" y="160" width="360" height="100" fill="#0284c7" />
        <line x1="0" y1="160" x2="360" y2="160" stroke="#0369a1" stroke-width="3" />
      </g>

      <!-- Natural Flat-Weave Linen & Jute Rug -->
      <polygon points="340,555 980,555 1120,698 220,698" fill="${rugFill}" rx="10" stroke="#cbd5e1" stroke-width="2" />

      <!-- Crisp White Slipcovered Sectional with Cerulean Pillows -->
      <g transform="translate(380, 440)">
        <rect x="0" y="0" width="480" height="85" rx="14" fill="#ffffff" stroke="#e2e8f0" stroke-width="3" />
        <!-- Blue Linen Pillows -->
        <rect x="40" y="25" width="55" height="48" rx="6" fill="#0284c7" />
        <rect x="380" y="25" width="55" height="48" rx="6" fill="#1e3a8a" />
      </g>

      <!-- Weathered Driftwood Low Table -->
      <g transform="translate(520, 565)">
        <rect x="0" y="0" width="240" height="26" rx="4" fill="#d6d3d1" stroke="#a8a29e" stroke-width="3" />
      </g>

      <!-- Greek Terracotta Amphora Urn on Left -->
      <g transform="translate(240, 430)">
        <path d="M 30,120 Q 10,70 40,40 Q 60,30 80,40 Q 110,70 90,120 Z" fill="#c2410c" stroke="#9a3412" stroke-width="3" />
      </g>

      <!-- Style badge -->
      <g transform="translate(48, 48)">
        <rect width="250" height="38" rx="6" fill="rgba(15, 23, 42, 0.85)" backdrop-filter="blur(8px)" />
        <circle cx="20" cy="19" r="5" fill="#0284c7" />
        <text x="36" y="24" fill="#f8fafc" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="600" letter-spacing="0.5">COASTAL MEDITERRANEAN</text>
      </g>
    `;
  }

  // Combine complete SVG with ambient lighting overlay
  const fullSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      ${content}
      <!-- Ambient Lighting Mask -->
      <rect width="${width}" height="${height}" fill="${ambientTint}" pointer-events="none" />
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg.trim())}`;
}
