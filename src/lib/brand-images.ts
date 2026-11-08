function iconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="116" fill="#f97316"/>
    <circle cx="216" cy="256" r="104" fill="none" stroke="#fffefc" stroke-width="56"/>
    <circle cx="376" cy="256" r="40" fill="#1c1917"/>
  </svg>`;
}

function ogSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#fffefc"/>
    <rect width="1200" height="16" fill="#f97316"/>
    <circle cx="1010" cy="300" r="190" fill="none" stroke="#f97316" stroke-opacity="0.14" stroke-width="2"/>
    <circle cx="1010" cy="300" r="118" fill="none" stroke="#f97316" stroke-opacity="0.18" stroke-width="2"/>
    <circle cx="1010" cy="300" r="8" fill="#f97316" fill-opacity="0.5"/>
    <g transform="translate(80 74)">
      <rect width="58" height="58" rx="14" fill="#f97316"/>
      <circle cx="25" cy="29" r="12" fill="none" stroke="#fffefc" stroke-width="6"/>
      <circle cx="43" cy="29" r="4.5" fill="#1c1917"/>
    </g>
    <text x="156" y="116" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700" letter-spacing="2" fill="#1c1917">ORIZ.IN</text>
    <text x="80" y="240" font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="700" letter-spacing="-2" fill="#1c1917">Knowledge.</text>
    <text x="80" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="700" letter-spacing="-2" fill="#1c1917">Sharp tools.</text>
    <text x="80" y="420" font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="700" letter-spacing="-2" fill="#c2410c">No noise.</text>
    <text x="82" y="492" font-family="Georgia, 'Times New Roman', serif" font-size="27" fill="#57534e">Practical articles, privacy-first browser tools,</text>
    <text x="82" y="528" font-family="Georgia, 'Times New Roman', serif" font-size="27" fill="#57534e">and references for people who build.</text>
    <line x1="80" y1="566" x2="1120" y2="566" stroke="#e7e0d8" stroke-width="1"/>
    <text x="80" y="600" font-family="Georgia, 'Times New Roman', serif" font-size="17" letter-spacing="2.5" fill="#8a8178">WEB  ·  DATA  ·  FINANCE  ·  NETWORKING  ·  DESIGN</text>
    <text x="1120" y="600" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-size="17" letter-spacing="1" fill="#8a8178">oriz.in</text>
  </svg>`;
}

export async function pngResponse(svg: string, width?: number): Promise<Response> {
  const { default: sharp } = await import('sharp');
  let image = sharp(Buffer.from(svg));
  if (width) image = image.resize(width);
  const buffer = await image.png().toBuffer();
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

export function renderIconPng(width = 512): Promise<Response> {
  return pngResponse(iconSvg(), width);
}

export function renderOgPng(): Promise<Response> {
  return pngResponse(ogSvg());
}
