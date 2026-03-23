#!/usr/bin/env node
/**
 * render-carousel.js
 * Engine de renderização HTML→PNG para carrosséis Instagram
 * 
 * Uso: node render-carousel.js <path-to-input.json>
 * 
 * Input JSON:
 *   { "carrossel_id": "...", "output_dir": "/tmp/...", "slides": [...] }
 * 
 * Tipos de slide:
 *   - texto_curto_imagem  → fundo branco, texto + imagem
 *   - texto_cheio         → fundo branco, só texto
 *   - cta_preto           → fundo preto, texto grande centralizado
 */

'use strict';

const puppeteer = require('/home/molt/.openclaw/workspace/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

// ── Constantes (calibradas com Figma refs) ──────────────────────────────────
const ASSETS_DIR = path.resolve(__dirname, '../skills/carrossel-intus/assets');
const BADGE_BLACK = path.join(ASSETS_DIR, 'badge-black.png');
const BADGE_WHITE = path.join(ASSETS_DIR, 'badge-white.png');

const SLIDE_W = 1080;
const SLIDE_H = 1350;
const PAD = 62;                    // padding lateral (conforme spec)
const PAD_TOP = 80;                // padding topo (calibrado com ref)
const CONTENT_W = SLIDE_W - PAD * 2;  // 956px

// Badge: PNG original 1128×396px → renderizado a ~40% = ~450×158px
const BADGE_ORIG_W = 1128;
const BADGE_ORIG_H = 396;
const BADGE_RENDER_W = 450;
const BADGE_RENDER_H = Math.round(BADGE_RENDER_W / BADGE_ORIG_W * BADGE_ORIG_H); // ~158px

// Posição do texto abaixo do badge
const TEXT_TOP = PAD_TOP + BADGE_RENDER_H + 30; // ~268px

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[render-carousel] ${msg}`);
}

function loadBadgeAsBase64(variant) {
  const filePath = variant === 'white' ? BADGE_WHITE : BADGE_BLACK;
  const data = fs.readFileSync(filePath);
  return `data:image/png;base64,${data.toString('base64')}`;
}

async function resolveImageSrc(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  if (fs.existsSync(imageUrl)) {
    const ext = path.extname(imageUrl).toLowerCase().replace('.', '');
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    const data = fs.readFileSync(imageUrl);
    return `data:${mime};base64,${data.toString('base64')}`;
  }
  return null;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * renderRichText — converte texto com **bold** em HTML
 * 
 * Regras:
 *   **texto**  → Inter 700 (bold)
 *   texto      → Inter 400 (regular)
 *   \n         → <br/>
 *   \n\n       → parágrafo com espaço extra (margin-top)
 * 
 * Exemplo:
 *   "**HEADLINE**\n\nTexto normal aqui.\n\n**Frase de impacto.**"
 */
function renderRichText(text) {
  if (!text) return '';
  
  const lines = text.split('\n');
  const htmlLines = lines.map(line => {
    // Escape HTML characters primeiro
    const escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Parse ^^hero^^ → palavra destaque BRANCA (para capas com fundo amarelo)
    const withHero = escaped.replace(/\^\^(.*?)\^\^/g,
      '<span style="color:#FFFFFF;font-weight:900;text-shadow:2px 2px 0px rgba(0,0,0,0.9),0 0 30px rgba(255,255,255,0.4)">$1</span>'
    );
    // Parse **bold** → <strong>
    return withHero.replace(/\*\*(.*?)\*\*/g,
      '<strong style="font-weight:700">$1</strong>'
    );
  });
  
  // Juntar linhas: linha vazia = parágrafo (espaço extra), linha normal = <br/>
  let result = '';
  for (let i = 0; i < htmlLines.length; i++) {
    const line = htmlLines[i];
    const prevEmpty = i > 0 && htmlLines[i - 1] === '';
    const isEmpty = line === '';
    
    if (isEmpty) {
      result += '<div style="height:0.6em"></div>';
    } else {
      if (result !== '' && !prevEmpty) {
        result += '<br/>';
      }
      result += line;
    }
  }
  
  return result;
}

// ── Template base ───────────────────────────────────────────────────────────

function htmlBase(bodyContent, bgColor = '#FFFFFF') {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1080"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${SLIDE_W}px;
    height: ${SLIDE_H}px;
    overflow: hidden;
    background: ${bgColor};
    font-family: 'Inter', 'Noto Color Emoji', 'Segoe UI Emoji', 'Apple Color Emoji', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .slide {
    position: relative;
    width: ${SLIDE_W}px;
    height: ${SLIDE_H}px;
    background: ${bgColor};
    overflow: hidden;
  }
  .badge {
    position: absolute;
    top: ${PAD_TOP}px;
    left: ${PAD}px;
    width: ${BADGE_RENDER_W}px;
    height: ${BADGE_RENDER_H}px;
    object-fit: contain;
    object-position: left center;
  }
  .text-main {
    position: absolute;
    top: ${TEXT_TOP}px;
    left: ${PAD}px;
    right: ${PAD}px;
    font-weight: 400;
    line-height: 1.35;
    word-break: break-word;
  }
</style>
</head>
<body>
<div class="slide">
${bodyContent}
</div>
</body>
</html>`;
}

// ── Templates por tipo ──────────────────────────────────────────────────────

/**
 * texto_curto_imagem — fundo branco, badge topo, texto + imagem opcional
 */
function templateTextoCurtoImagem({ text, badgeSrc, imageSrc }) {
  // Se tem imagem: texto menor + imagem embaixo
  // Se não tem imagem: texto ocupa mais espaço (mas font-size de texto curto)
  const hasImage = !!imageSrc;
  const fontSize = hasImage ? 44 : 46;
  
  // Imagem: posicionar abaixo do texto, antes da borda inferior
  // 650px = maior quadrado que cabe sem sobreposição com o texto
  const imgH = 650;

  const imageBlock = hasImage ? `
    <div class="image-wrap" style="
      position: absolute;
      bottom: ${PAD}px;
      left: ${PAD}px;
      right: ${PAD}px;
      height: ${imgH}px;
      border-radius: 16px;
      overflow: hidden;
      background: #FFFFFF;
    ">
      <img src="${imageSrc}" alt="" style="width:100%; height:100%; object-fit:cover; object-position:center center;"/>
    </div>` : '';

  const textBottom = hasImage ? `bottom: ${PAD + imgH + 30}px;` : `bottom: ${PAD}px;`;

  const bodyContent = `
    <img class="badge" src="${badgeSrc}" alt=""/>
    <div class="text-main" style="
      font-size: ${fontSize}px;
      color: #000000;
      ${textBottom}
    ">${renderRichText(text)}</div>
    ${imageBlock}`;

  return htmlBase(bodyContent, '#FFFFFF');
}

/**
 * texto_cheio — fundo branco, badge topo, texto longo preenche slide
 */
function templateTextoCheio({ text, badgeSrc }) {
  // Texto longo: auto-ajuste de font-size via JS no navegador
  const bodyContent = `
    <img class="badge" src="${badgeSrc}" alt=""/>
    <div class="text-main" id="mainText" style="
      font-size: 44px;
      color: #000000;
      bottom: ${PAD}px;
    ">${renderRichText(text)}</div>

    <script>
      (function() {
        var el = document.getElementById('mainText');
        var maxH = ${SLIDE_H} - ${TEXT_TOP} - ${PAD};
        var size = 44;
        while (el.scrollHeight > maxH && size > 24) {
          size -= 1;
          el.style.fontSize = size + 'px';
        }
      })();
    </script>`;

  return htmlBase(bodyContent, '#FFFFFF');
}

/**
 * cta_preto — fundo preto, badge branco, headline amarela + corpo branco misto
 * 
 * JSON input:
 *   "headline": "FRASE DESTAQUE EM AMARELO"   ← AMARELO #FFCC00, bold, ~65pt
 *   "text": "corpo com **bold** e regular"     ← BRANCO, misto, ~44pt
 */
function templateCtaPreto({ headline, text, badgeSrc }) {
  const headlineHtml = headline
    ? `<div id="ctaHeadline" style="
        font-size: 70px;
        font-weight: 800;
        line-height: 1.18;
        color: #FFCC00;
        word-break: break-word;
        margin-bottom: 32px;
      ">${renderRichText(headline)}</div>` : '';

  const bodyContent = `
    <img class="badge" src="${badgeSrc}" alt=""/>

    <div id="ctaWrap" style="
      position: absolute;
      top: ${TEXT_TOP}px;
      left: ${PAD}px;
      right: ${PAD}px;
      bottom: ${PAD}px;
      overflow: hidden;
    ">
      ${headlineHtml}
      <div id="ctaText" style="
        font-size: 58px;
        font-weight: 400;
        line-height: 1.35;
        color: #FFFFFF;
        word-break: break-word;
      ">${renderRichText(text)}</div>
    </div>

    <script>
      (function() {
        var wrap = document.getElementById('ctaWrap');
        var headlineEl = document.getElementById('ctaHeadline');
        var bodyEl = document.getElementById('ctaText');
        var maxH = wrap.clientHeight;
        // Auto-reduce body font se overflow
        var size = 44;
        while (wrap.scrollHeight > maxH && size > 20) {
          size -= 1;
          bodyEl.style.fontSize = size + 'px';
        }
        // Se ainda overflow, reduzir headline também
        var hSize = 48;
        while (wrap.scrollHeight > maxH && hSize > 30 && headlineEl) {
          hSize -= 1;
          headlineEl.style.fontSize = hSize + 'px';
        }
      })();
    </script>`;

  return htmlBase(bodyContent, '#000000');
}

/**
 * capa — imagem full bleed, gradiente na base, badge topo, headline amarela
 *
 * JSON input:
 *   "image_url": "/path/to/capa.png"   ← imagem de fundo (full bleed)
 *   "headline": "TEXTO EM CAIXA ALTA"  ← amarelo neon, bold, grande
 */
/**
 * templateCapa — 5 layouts disponíveis via `text_layout`:
 *   "bottom_left"   (padrão) — texto canto inferior esquerdo, left-aligned
 *   "centered"      — texto centralizado horizontal+vertical na metade inferior
 *   "column"        — cada linha ocupa toda a largura, empilhadas, fonte máxima
 *   "hierarchy"     — linha central em destaque máximo, linhas laterais menores
 *   "split"         — primeira linha no topo, restante na base (efeito cinematográfico)
 */
function templateCapa({ headline, badgeSrc, imageSrc, textLayout = 'bottom_left' }) {

  // ── Gradiente: mais profundo para layouts que precisam de leitura central
  const gradientHeight = (textLayout === 'centered' || textLayout === 'hierarchy') ? '75%' : '55%';
  const gradientBg = (textLayout === 'centered' || textLayout === 'hierarchy')
    ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.75) 50%, transparent 100%)'
    : 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)';

  // ── Estilo base do texto (compartilhado)
  const baseTextStyle = `
    font-weight: 900;
    color: #FFE600;
    word-break: break-word;
    text-transform: uppercase;
    text-shadow: 3px 3px 0px rgba(0,0,0,0.8), 0 0 20px rgba(255,230,0,0.3);
  `;

  // ── Monta bloco de headline conforme layout
  let headlineBlock = '';
  let scriptBlock = '';

  if (textLayout === 'bottom_left') {
    // LAYOUT 1 — padrão: inferior esquerdo, left-aligned, dinâmico
    headlineBlock = headline ? `
      <div style="
        position: absolute;
        bottom: ${PAD}px;
        left: ${PAD}px;
        right: ${PAD}px;
        z-index: 2;
      ">
        <div id="capaHeadline" style="${baseTextStyle} font-size:80px; line-height:1.1; letter-spacing:-1px;">
          ${renderRichText(headline)}
        </div>
      </div>` : '';
    scriptBlock = `
      (function() {
        var el = document.getElementById('capaHeadline');
        if (!el) return;
        var maxH = ${SLIDE_H * 0.48};
        var minH = ${SLIDE_H * 0.20};
        var size = 80;
        el.style.fontSize = size + 'px';
        while (el.scrollHeight > maxH && size > 40) { size -= 2; el.style.fontSize = size + 'px'; }
        while (el.scrollHeight < minH && size < 130) {
          size += 4; el.style.fontSize = size + 'px';
          if (el.scrollHeight > maxH) { size -= 4; el.style.fontSize = size + 'px'; break; }
        }
      })();`;

  } else if (textLayout === 'centered') {
    // LAYOUT 2 — centralizado: texto no centro da metade inferior, alinhado ao centro
    headlineBlock = headline ? `
      <div style="
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 65%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 ${PAD}px;
        z-index: 2;
      ">
        <div id="capaHeadline" style="${baseTextStyle} font-size:80px; line-height:1.15; letter-spacing:-1px; text-align:center; width:100%;">
          ${renderRichText(headline)}
        </div>
      </div>` : '';
    scriptBlock = `
      (function() {
        var el = document.getElementById('capaHeadline');
        if (!el) return;
        var maxH = ${SLIDE_H * 0.55};
        var minH = ${SLIDE_H * 0.22};
        var size = 80;
        el.style.fontSize = size + 'px';
        while (el.scrollHeight > maxH && size > 38) { size -= 2; el.style.fontSize = size + 'px'; }
        while (el.scrollHeight < minH && size < 140) {
          size += 4; el.style.fontSize = size + 'px';
          if (el.scrollHeight > maxH) { size -= 4; el.style.fontSize = size + 'px'; break; }
        }
      })();`;

  } else if (textLayout === 'bottom_center') {
    // LAYOUT 3 — inferior centralizado: como bottom_left mas alinhado ao centro, fonte grande
    headlineBlock = headline ? `
      <div style="
        position: absolute;
        bottom: ${PAD}px;
        left: ${PAD}px;
        right: ${PAD}px;
        z-index: 2;
        text-align: center;
      ">
        <div id="capaHeadline" style="${baseTextStyle} font-size:100px; line-height:1.08; letter-spacing:-2px; text-align:center;">
          ${renderRichText(headline)}
        </div>
      </div>` : '';
    scriptBlock = `
      (function() {
        var el = document.getElementById('capaHeadline');
        if (!el) return;
        var maxH = ${SLIDE_H * 0.50};
        var minH = ${SLIDE_H * 0.32};
        var size = 100;
        el.style.fontSize = size + 'px';
        while (el.scrollHeight > maxH && size > 40) { size -= 2; el.style.fontSize = size + 'px'; }
        while (el.scrollHeight < minH && size < 170) {
          size += 4; el.style.fontSize = size + 'px';
          if (el.scrollHeight > maxH) { size -= 4; el.style.fontSize = size + 'px'; break; }
        }
      })();`;

  } else if (textLayout === 'crescente') {
    // LAYOUT 4 — crescente: linhas com tamanho progressivo, maior embaixo (clímax na última linha)
    const lines = (headline || '').split('\n').filter(l => l.trim());
    const total = lines.length || 1;
    const lineHtml = lines.map((line, i) => {
      const ratio = 0.50 + (i / (total - 1 || 1)) * 0.50; // 50% → 100% do tamanho base
      return `<div id="capaLine${i}" style="${baseTextStyle} font-size:${Math.round(120 * ratio)}px; line-height:1.0; letter-spacing:-2px;">
        ${renderRichText(line)}
      </div>`;
    }).join('');
    headlineBlock = `
      <div style="
        position: absolute;
        bottom: ${PAD}px;
        left: ${PAD}px;
        right: ${PAD}px;
        z-index: 2;
      ">
        <div id="capaHeadline">${lineHtml}</div>
      </div>`;
    scriptBlock = `
      (function() {
        var wrap = document.getElementById('capaHeadline');
        if (!wrap) return;
        var maxH = ${SLIDE_H * 0.55};
        var scale = 1;
        while (wrap.scrollHeight > maxH && scale > 0.5) {
          scale -= 0.03;
          wrap.style.transform = 'scale(' + scale + ')';
          wrap.style.transformOrigin = 'bottom left';
        }
      })();`;

  } else if (textLayout === 'magazine') {
    // LAYOUT 5 — magazine: texto no centro exato do slide, estilo capa de revista
    headlineBlock = headline ? `
      <div style="
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 ${PAD}px;
        z-index: 2;
      ">
        <div id="capaHeadline" style="${baseTextStyle} font-size:80px; line-height:1.12; letter-spacing:-1px; text-align:center; width:100%;">
          ${renderRichText(headline)}
        </div>
      </div>` : '';
    scriptBlock = `
      (function() {
        var el = document.getElementById('capaHeadline');
        if (!el) return;
        var maxH = ${SLIDE_H * 0.60};
        var minH = ${SLIDE_H * 0.25};
        var size = 80;
        el.style.fontSize = size + 'px';
        while (el.scrollHeight > maxH && size > 38) { size -= 2; el.style.fontSize = size + 'px'; }
        while (el.scrollHeight < minH && size < 150) {
          size += 4; el.style.fontSize = size + 'px';
          if (el.scrollHeight > maxH) { size -= 4; el.style.fontSize = size + 'px'; break; }
        }
      })();`;
  }

  const bodyContent = `
    <!-- Background image full bleed -->
    ${imageSrc ? `<img src="${imageSrc}" alt="" style="
      position: absolute; top: 0; left: 0;
      width: ${SLIDE_W}px; height: ${SLIDE_H}px;
      object-fit: cover; object-position: center center; z-index: 0;
    "/>` : ''}

    <!-- Gradiente escuro -->
    <div style="
      position: absolute; bottom: 0; left: 0; right: 0;
      height: ${gradientHeight};
      background: ${gradientBg};
      z-index: 1;
    "></div>

    ${headlineBlock}

    <script>(function(){ ${scriptBlock} })();</script>`;

  return htmlBase(bodyContent, '#111111');
}

// ── Gerador HTML por slide ──────────────────────────────────────────────────

async function generateSlideHtml(slide) {
  const { type, text, image_url } = slide;
  const imageSrc = await resolveImageSrc(image_url);

  switch (type) {
    case 'capa': {
      const badgeSrc = loadBadgeAsBase64('white');
      const headline = slide.headline || slide.text || '';
      const textLayout = slide.text_layout || 'bottom_left';
      return templateCapa({ headline, badgeSrc, imageSrc, textLayout });
    }
    case 'texto_curto_imagem': {
      const badgeSrc = loadBadgeAsBase64('black');
      return templateTextoCurtoImagem({ text, badgeSrc, imageSrc });
    }
    case 'texto_cheio': {
      const badgeSrc = loadBadgeAsBase64('black');
      return templateTextoCheio({ text, badgeSrc });
    }
    case 'cta_preto': {
      const badgeSrc = loadBadgeAsBase64('white');
      const headline = slide.headline || null;
      return templateCtaPreto({ headline, text, badgeSrc });
    }
    default:
      throw new Error(`Tipo de slide desconhecido: "${type}"`);
  }
}

// ── Renderizador Puppeteer ────────────────────────────────────────────────────

async function renderSlide(page, html, outputPath) {
  await page.setContent(html, {
    waitUntil: 'domcontentloaded',
    timeout: 15000,
  });

  // Aguarda fonte + auto-resize scripts (com timeout de segurança)
  await Promise.race([
    page.evaluate(() => document.fonts.ready),
    new Promise(resolve => setTimeout(resolve, 3000)),
  ]);
  // Pequeno delay para scripts de auto-resize
  await new Promise(resolve => setTimeout(resolve, 200));

  await page.screenshot({
    path: outputPath,
    type: 'png',
    clip: { x: 0, y: 0, width: SLIDE_W, height: SLIDE_H },
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Uso: node render-carousel.js <path-to-input.json>');
    process.exit(1);
  }

  const inputAbs = path.resolve(inputPath);
  if (!fs.existsSync(inputAbs)) {
    console.error(`Arquivo não encontrado: ${inputAbs}`);
    process.exit(1);
  }

  const input = JSON.parse(fs.readFileSync(inputAbs, 'utf-8'));
  const { carrossel_id, output_dir, slides } = input;

  if (!slides || !Array.isArray(slides) || slides.length === 0) {
    console.error('JSON inválido: "slides" deve ser um array não-vazio');
    process.exit(1);
  }

  const outputAbs = path.resolve(output_dir);
  fs.mkdirSync(outputAbs, { recursive: true });

  log(`Carrossel: ${carrossel_id}`);
  log(`Output dir: ${outputAbs}`);
  log(`Slides: ${slides.length}`);
  log('Iniciando Puppeteer...');

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=none',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: SLIDE_W,
      height: SLIDE_H,
      deviceScaleFactor: 1,
    });

    const generated = [];
    const errors = [];

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const slideLabel = slide.slide || `slide_${i + 1}`;
      const outFile = path.join(outputAbs, `${slideLabel}.png`);

      log(`[${i + 1}/${slides.length}] Renderizando ${slideLabel} (${slide.type})...`);

      try {
        const html = await generateSlideHtml(slide);
        await renderSlide(page, html, outFile);
        const stats = fs.statSync(outFile);
        log(`  ✓ ${outFile} (${(stats.size / 1024).toFixed(1)} KB)`);
        generated.push(outFile);
      } catch (err) {
        log(`  ✗ Erro em ${slideLabel}: ${err.message}`);
        errors.push({ slide: slideLabel, error: err.message });
      }
    }

    log('');
    log('══════════════════════════════════');
    log(`Concluído: ${generated.length}/${slides.length} slides gerados`);
    if (errors.length > 0) {
      log(`Erros: ${errors.length}`);
      errors.forEach(e => log(`  - ${e.slide}: ${e.error}`));
    }
    log('══════════════════════════════════');

    const result = {
      carrossel_id,
      output_dir: outputAbs,
      generated,
      errors,
      success: errors.length === 0,
    };
    process.stdout.write('\n__RESULT__\n' + JSON.stringify(result, null, 2) + '\n');

    if (errors.length > 0) process.exit(2);

  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});
