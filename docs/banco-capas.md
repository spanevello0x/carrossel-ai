# Banco de Capas — CarrosselAI

Catálogo de tipos de capa com dois modelos de entrega de prompt JSON.

---

## DOIS MODELOS DE ENTREGA

### MODELO LIMPO
Usado quando o pedido é apenas a imagem pura — sem texto sobreposto.
Entrega somente o campo "prompt" e "negative_prompt".
O designer adiciona a headline depois no Canva/Figma.

### MODELO HEADLINE
Usado quando o pedido é a imagem + headline integrada no JSON.
Entrega "prompt", "text_overlay" completo e "negative_prompt".
Headline sempre em PT-BR, caixa alta, sem referência à marca.

---

## REGRAS UNIVERSAIS

- Texto: amarelo neon caixa alta (padrão) | branco (trauma/urgência) | verde matrix (dados/terminal)
- Dado monetário ancora sempre a escala
- Verbo no presente/passado recente — nunca futuro vago
- Máximo 3 elementos visuais
- Gradient strip escuro na parte inferior (38% da imagem) para o texto
- Accent line fina acima do headline (amarela padrão, vermelha para conspiração/conflito)
- Sem referência à marca em nenhum dos modelos

---

## TIPO 1 — SALA DE GUERRA / MAPA MUNDIAL

Gatilho: CURIOSIDADE + REVOLTA
Headline formula: [TODA/TODO] [SUJEITO] SEGUE / O MESMO ROTEIRO. / OS [QUEM] JÁ SABEM O FIM.

### MODELO LIMPO
{
 "prompt": "A dark war room with a massive illuminated world map covering the entire back wall. Glowing lines connect conflict zones marked with subtle military icons. A man in a sharp black suit, back to camera, stands pointing at the map with authority. The room is dimly lit with dramatic shadows. Color palette: deep blacks, dark greens, muted khakis, with yellow-amber light emanating from the map. Atmosphere: secretive, powerful, cinematic. Style: photorealistic, high contrast, dramatic lighting, editorial photography aesthetic. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "colorful, bright, cartoon, illustration, modern clean aesthetic, visible faces, gore, digital art look"
}

### MODELO HEADLINE
{
 "prompt": "A dark war room with a massive illuminated world map covering the entire back wall. Glowing lines connect conflict zones marked with subtle military icons. A man in a sharp black suit, back to camera, stands pointing at the map with authority. The room is dimly lit with dramatic shadows. Color palette: deep blacks, dark greens, muted khakis, with yellow-amber light emanating from the map. Atmosphere: secretive, powerful, cinematic. Style: photorealistic, high contrast, dramatic lighting, editorial photography aesthetic. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "horizontal dark gradient strip, semi-transparent black to transparent, full width, 38% height",
  "font_style": "ultra bold condensed military stencil typeface, all caps",
  "font_color": "#FFE600",
  "font_size": "72px",
  "line_height": "1.1",
  "text_shadow": "3px 3px 0px #000000",
  "accent_line": { "color": "#FFE600", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "colorful, bright, cartoon, illustration, modern clean aesthetic, visible faces, gore, digital art look"
}

---

## TIPO 2 — DOSSIER SECRETO / FIOS VERMELHOS

Gatilho: CURIOSIDADE + CONSPIRAÇÃO
Headline formula: [EVENTO 1]. [EVENTO 2]. [EVENTO 3]. / O ROTEIRO NÃO MUDA. / SÓ OS PERSONAGENS.

### MODELO LIMPO
{
 "prompt": "Overhead shot of a dark aged mahogany table covered in black and white photographs of historical conflict zones connected by red strings pinned with small metal tacks. Worn documents, military maps and classified stamps visible between photos. A hand wearing a black leather glove reaches into frame from the top, carefully placing one final photograph face down. Single vintage pendant lamp casting a dramatic warm cone of light directly over the table center, everything outside the light cone falls into deep shadow. Dust particles visible in the light beam. Color palette: deep blacks and dark browns, desaturated sepia tones for photographs, vivid red strings as only color accent, warm amber from lamp. Style: photorealistic, cinematic noir, ultra detailed, dramatic chiaroscuro lighting. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "colorful background, bright lighting, flat shadows, cartoon, modern aesthetic, color photographs, visible faces, gore, digital art look"
}

### MODELO HEADLINE
{
 "prompt": "Overhead shot of a dark aged mahogany table covered in black and white photographs of historical conflict zones connected by red strings pinned with small metal tacks. Worn documents, military maps and classified stamps visible between photos. A hand wearing a black leather glove reaches into frame from the top, carefully placing one final photograph face down. Single vintage pendant lamp casting a dramatic warm cone of light directly over the table center, everything outside the light cone falls into deep shadow. Dust particles visible in the light beam. Color palette: deep blacks and dark browns, desaturated sepia tones for photographs, vivid red strings as only color accent, warm amber from lamp. Style: photorealistic, cinematic noir, ultra detailed, dramatic chiaroscuro lighting. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "linear gradient from solid black (100%) to transparent, bottom to top, 38% height",
  "font_style": "ultra bold condensed military stencil typeface, all caps",
  "font_color": "#FFE600",
  "font_size": "72px",
  "line_height": "1.1",
  "text_shadow": "3px 3px 0px #000000",
  "accent_line": { "color": "#CC0000", "width": "60px", "position": "above headline", "note": "vermelho espelha os fios da imagem" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "colorful background, bright lighting, flat shadows, cartoon, modern aesthetic, color photographs, visible faces, gore, digital art look"
}

---

## TIPO 3 — TABULEIRO DE XADREZ GEOPOLÍTICO

Gatilho: CURIOSIDADE + PODER FRIO
Headline formula: [VERBO] [SUJEITO] SEGUE / O MESMO ROTEIRO. / [QUEM] JÁ SABE O FIM.

### MODELO LIMPO
{
 "prompt": "A dramatic overhead shot of a dark chess board viewed from slightly above. Chess pieces replaced by symbolic objects: King = miniature oil barrel, Queen = rising stock market chart, Bishops = military generals in uniform, Knights = fighter jets, Rooks = bank buildings, Pawns = small soldier silhouettes. A single hand in a perfectly tailored black suit sleeve reaches into frame from the right, moving a piece with precision. The board sits on a dark mahogany surface. Lighting: single dramatic spotlight from above creating deep shadows between pieces, gold and amber rim lighting on piece edges. Color palette: deep black, dark green chess squares, gold metallic pieces, single beam of cold white light. Atmosphere: cold, calculated, powerful, cinematic. Style: photorealistic, ultra detailed macro photography, editorial luxury aesthetic. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "colorful, bright background, cartoon, illustration, flat design, amateur lighting, cluttered composition, readable text on chess board"
}

### MODELO HEADLINE
{
 "prompt": "A dramatic overhead shot of a dark chess board viewed from slightly above. Chess pieces replaced by symbolic objects: King = miniature oil barrel, Queen = rising stock market chart, Bishops = military generals in uniform, Knights = fighter jets, Rooks = bank buildings, Pawns = small soldier silhouettes. A single hand in a perfectly tailored black suit sleeve reaches into frame from the right, moving a piece with precision. The board sits on a dark mahogany surface. Lighting: single dramatic spotlight from above creating deep shadows between pieces, gold and amber rim lighting on piece edges. Color palette: deep black, dark green chess squares, gold metallic pieces, single beam of cold white light. Atmosphere: cold, calculated, powerful, cinematic. Style: photorealistic, ultra detailed macro photography, editorial luxury aesthetic. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "linear gradient from solid black (100%) to transparent, bottom to top, 35% height",
  "font_style": "ultra bold condensed military stencil typeface, all caps",
  "font_color": "#FFE600",
  "font_size": "72px",
  "line_height": "1.1",
  "text_shadow": "3px 3px 0px #000000, 0px 0px 12px rgba(255,230,0,0.3)",
  "accent_line": { "color": "#FFE600", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "colorful, bright background, cartoon, illustration, flat design, amateur lighting, cluttered composition, readable text on chess board"
}

---

## TIPO 4 — CONTRASTE DOIS MUNDOS (VAREJO vs INSTITUCIONAL)

Gatilho: REVOLTA + IDENTIFICAÇÃO
Headline formula: VOCÊ [AÇÃO EMOCIONAL]. / ELES [AÇÃO CALCULADA]. / SEMPRE FOI ASSIM.

### MODELO LIMPO
{
 "prompt": "A vertically split screen image. Left side: ordinary person sitting at a desk, face illuminated by a deep red falling stock chart on screen, expression blank and paralyzed with fear, cold desaturated blue-gray tones. Right side: dark boardroom, several men in sharp suits seated calmly around a long table, faces composed and calculating, cold blue light from data screens, no emotion. The dividing line between the two sides is sharp and dramatic. Atmosphere: contrast between panic and cold calculation. Style: photorealistic, cinematic, high contrast, editorial photography. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "happy expressions, warm colors on right side, cartoon, illustration, bright lighting, flat design, stock photo aesthetic"
}

### MODELO HEADLINE
{
 "prompt": "A vertically split screen image. Left side: ordinary person sitting at a desk, face illuminated by a deep red falling stock chart on screen, expression blank and paralyzed with fear, cold desaturated blue-gray tones. Right side: dark boardroom, several men in sharp suits seated calmly around a long table, faces composed and calculating, cold blue light from data screens, no emotion. The dividing line between the two sides is sharp and dramatic. Atmosphere: contrast between panic and cold calculation. Style: photorealistic, cinematic, high contrast, editorial photography. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "linear gradient from solid black (100%) to transparent, bottom to top, 38% height",
  "font_style": "ultra bold condensed sans-serif, all caps",
  "font_color": "#FFE600",
  "font_size": "72px",
  "line_height": "1.1",
  "text_shadow": "2px 2px 0px #000000",
  "accent_line": { "color": "#FFE600", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "happy expressions, warm colors on right side, cartoon, illustration, bright lighting, flat design"
}

---

## TIPO 5 — DADO TERMINAL / ESTILO MATRIX

Gatilho: CHOQUE + URGÊNCIA
Headline formula: [DADO 1]: [NÚMERO] / [DADO 2]: [NÚMERO] / O DADO QUE [IMPLICAÇÃO].

### MODELO LIMPO
{
 "prompt": "Pure black background. A glowing green monospace terminal screen fills the frame, displaying financial data in retro computer font — numbers, percentages, labels in cascading lines. A blinking cursor at the end of the last line. Slight scanline texture overlay. Atmosphere: urgency, raw data, machine precision, no human element. Style: high contrast digital art, retro terminal aesthetic, clean and minimal. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "colorful, warm tones, cartoon, people, faces, modern UI design, icons, gradients"
}

### MODELO HEADLINE
{
 "prompt": "Pure black background. A glowing green monospace terminal screen fills the frame, displaying financial data in retro computer font — numbers, percentages, labels in cascading lines. A blinking cursor at the end of the last line. Slight scanline texture overlay. Atmosphere: urgency, raw data, machine precision, no human element. Style: high contrast digital art, retro terminal aesthetic, clean and minimal. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "pure black strip, solid, 38% height",
  "font_style": "monospace bold, all caps",
  "font_color": "#00FF41",
  "font_size": "64px",
  "line_height": "1.2",
  "text_shadow": "0px 0px 8px rgba(0,255,65,0.6)",
  "accent_line": { "color": "#00FF41", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "colorful, warm tones, cartoon, people, faces, modern UI design, icons, gradients"
}

---

## TIPO 6 — APAGÃO / VISTA AÉREA NOTURNA

Gatilho: REVOLTA + IMPACTO VISUAL
Headline formula: [QUEM SOFRE] FICA [CONSEQUÊNCIA]. / [QUEM LUCRA] CONTINUA [AÇÃO]. / [DADO IMPACTANTE].

### MODELO LIMPO
{
 "prompt": "Aerial night shot of a large Middle Eastern city with a partial blackout — half the city in complete darkness, half illuminated. In the illuminated industrial areas, a distinctive green-blue glow characteristic of Bitcoin mining farms is visible between buildings. The contrast between dark residential areas and the lit mining operations is stark and dramatic. Camera angle: high altitude satellite-style perspective, cold and distant. Color palette: deep black void for dark areas, warm city lights for inhabited zones, cold green-blue for mining areas. Style: photorealistic aerial photography, cinematic, documentary. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "cartoon, illustration, warm overall tones, people, close-up, daylight, bright sky"
}

### MODELO HEADLINE
{
 "prompt": "Aerial night shot of a large Middle Eastern city with a partial blackout — half the city in complete darkness, half illuminated. In the illuminated industrial areas, a distinctive green-blue glow characteristic of Bitcoin mining farms is visible between buildings. The contrast between dark residential areas and the lit mining operations is stark and dramatic. Camera angle: high altitude satellite-style perspective, cold and distant. Color palette: deep black void for dark areas, warm city lights for inhabited zones, cold green-blue for mining areas. Style: photorealistic aerial photography, cinematic, documentary. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "linear gradient from solid black (100%) to transparent, bottom to top, 38% height",
  "font_style": "ultra bold condensed sans-serif, all caps",
  "font_color": "#FFFFFF",
  "font_size": "72px",
  "line_height": "1.1",
  "text_shadow": "2px 2px 0px #000000",
  "accent_line": { "color": "#FFFFFF", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "cartoon, illustration, warm overall tones, people, close-up, daylight, bright sky"
}

---

## TIPO 7 — HERÓI E VILÃO NA MESMA FIGURA

Gatilho: CURIOSIDADE + ESTRANHAMENTO
Headline formula: [TECNOLOGIA] NO [CONTEXTO]. / [BENEFÍCIO]. / [CUSTO]. / AO MESMO TEMPO.

### MODELO LIMPO
{
 "prompt": "A single human figure viewed from the front, body divided down the middle purely by contrasting light — no visible line or border. Left half: ordinary clothing, expression of relief and hope, warm golden light emanating from a phone screen showing a digital wallet interface. Right half: exact same body now in a dark suit, cold calculating expression, holding a document with a government seal, illuminated by cold blue-white institutional light. Below the feet: a single shadow splitting into two profiles pointing in opposite directions. Style: photorealistic, cinematic, surreal lighting split, editorial photography. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "obvious dividing line, cartoon, illustration, two different people, warm tones on right side, flat lighting"
}

### MODELO HEADLINE
{
 "prompt": "A single human figure viewed from the front, body divided down the middle purely by contrasting light — no visible line or border. Left half: ordinary clothing, expression of relief and hope, warm golden light emanating from a phone screen showing a digital wallet interface. Right half: exact same body now in a dark suit, cold calculating expression, holding a document with a government seal, illuminated by cold blue-white institutional light. Below the feet: a single shadow splitting into two profiles pointing in opposite directions. Style: photorealistic, cinematic, surreal lighting split, editorial photography. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "linear gradient from solid black (100%) to transparent, bottom to top, 38% height",
  "font_style": "ultra bold condensed sans-serif, all caps",
  "font_color": "#FFE600",
  "font_size": "68px",
  "line_height": "1.1",
  "text_shadow": "2px 2px 0px #000000",
  "accent_line": { "color": "#FFE600", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "obvious dividing line, cartoon, illustration, two different people, warm tones on right side, flat lighting"
}

---

## TIPO 8 — BOT/IA NO ESCURO (CYBERPUNK)

Gatilho: REVOLTA + CURIOSIDADE
Headline formula: UM [AGENTE NÃO-HUMANO] FEZ [RESULTADO]. / ENQUANTO VOCÊ [AÇÃO NORMAL].

### MODELO LIMPO
{
 "prompt": "A dark trading desk setup with multiple monitors glowing in the darkness. On the screens: a prediction market dashboard with a large green profit number. Seated in the office chair: a metallic robot figure with glowing red LED eyes, posture of a focused trader. No human in the scene — only the machine operating alone in the dark. Subtle green neon reflections on the desk surface. Style: photorealistic cyberpunk, cinematic, high contrast, dark atmosphere. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "humans, daylight, warm colors, cartoon, illustration, flat design, bright background, cute robot"
}

### MODELO HEADLINE
{
 "prompt": "A dark trading desk setup with multiple monitors glowing in the darkness. On the screens: a prediction market dashboard with a large green profit number. Seated in the office chair: a metallic robot figure with glowing red LED eyes, posture of a focused trader. No human in the scene — only the machine operating alone in the dark. Subtle green neon reflections on the desk surface. Style: photorealistic cyberpunk, cinematic, high contrast, dark atmosphere. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "linear gradient from solid black (100%) to transparent, bottom to top, 38% height",
  "font_style": "ultra bold condensed sans-serif, all caps",
  "font_color": "#00FF41",
  "font_size": "72px",
  "line_height": "1.1",
  "text_shadow": "0px 0px 10px rgba(0,255,65,0.5)",
  "accent_line": { "color": "#00FF41", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "humans, daylight, warm colors, cartoon, illustration, flat design, bright background, cute robot"
}

---

## TIPO 9 — FAZENDA DE MINERAÇÃO (ESCALA INDUSTRIAL)

Gatilho: CHOQUE + ESCALA
Headline formula: ENQUANTO VOCÊ [AÇÃO COMUM], / [SUJEITO] MINERA [PRODUTO] / POR [PREÇO BAIXO]. / VENDE POR [PREÇO ALTO].

### MODELO LIMPO
{
 "prompt": "Interior of a massive Bitcoin mining facility. Endless rows of ASIC miners stretching to the horizon, all blinking with green and blue LEDs in the dark. Camera at floor level looking toward the vanishing point — the rows appear infinite. Subtle mist in the air from cooling systems. Cold industrial atmosphere, no humans. Color palette: deep blacks, blue-green LED glow, faint warm light from distant power indicators. Style: photorealistic, cinematic, ultra wide angle, documentary industrial photography. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "humans, warm lighting, cartoon, illustration, bright background, small scale, cozy, daylight"
}

### MODELO HEADLINE
{
 "prompt": "Interior of a massive Bitcoin mining facility. Endless rows of ASIC miners stretching to the horizon, all blinking with green and blue LEDs in the dark. Camera at floor level looking toward the vanishing point — the rows appear infinite. Subtle mist in the air from cooling systems. Cold industrial atmosphere, no humans. Color palette: deep blacks, blue-green LED glow, faint warm light from distant power indicators. Style: photorealistic, cinematic, ultra wide angle, documentary industrial photography. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "linear gradient from solid black (100%) to transparent, bottom to top, 38% height",
  "font_style": "ultra bold condensed sans-serif, all caps",
  "font_color": "#FFE600",
  "font_size": "72px",
  "line_height": "1.1",
  "text_shadow": "2px 2px 0px #000000",
  "accent_line": { "color": "#FFE600", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "humans, warm lighting, cartoon, illustration, bright background, small scale, cozy, daylight"
}

---

## TIPO 10 — HUMOR / CARICATURA DE LÍDER

Gatilho: HUMOR + IDENTIFICAÇÃO
Nota: Sempre estilo caricatura — nunca fotorrealista de pessoa real. Sempre incluir [REFERENCE FACE IMAGE ATTACHED].
Headline formula: SEXTA, 22H. / MERCADOS FECHADOS. / [PERSONAGEM]: [AÇÃO INESPERADA].

### MODELO LIMPO
{
 "prompt": "Caricature-style hyperrealistic illustration of a powerful world leader figure [REFERENCE FACE IMAGE ATTACHED]. Slightly exaggerated facial features in caricature style. Scene: [DESCREVER CENA]. Color palette: [DESCREVER PALETA]. Atmosphere: [DESCREVER ATMOSFERA]. Style: caricature illustration with photorealistic rendering quality, cinematic lighting, editorial humor. Vertical format 4:5. 8K resolution.",
 "negative_prompt": "photorealistic portrait, serious tone, realistic proportions, stock photo style, offensive content"
}

### MODELO HEADLINE
{
 "prompt": "Caricature-style hyperrealistic illustration of a powerful world leader figure [REFERENCE FACE IMAGE ATTACHED]. Slightly exaggerated facial features in caricature style. Scene: [DESCREVER CENA]. Color palette: [DESCREVER PALETA]. Atmosphere: [DESCREVER ATMOSFERA]. Style: caricature illustration with photorealistic rendering quality, cinematic lighting, editorial humor. Vertical format 4:5. 8K resolution.",
 "text_overlay": {
  "headline": "[HEADLINE EM PT-BR AQUI]",
  "position": "bottom",
  "alignment": "left",
  "padding": "40px",
  "background": "linear gradient from solid black (100%) to transparent, bottom to top, 35% height",
  "font_style": "ultra bold condensed sans-serif, all caps",
  "font_color": "#FFE600",
  "font_size": "72px",
  "line_height": "1.1",
  "text_shadow": "2px 2px 0px #000000",
  "accent_line": { "color": "#FFE600", "width": "60px", "position": "above headline", "margin_bottom": "12px" }
 },
 "format": { "aspect_ratio": "4:5", "resolution": "1080x1350px", "safe_zone": "60px all sides" },
 "negative_prompt": "photorealistic portrait, serious tone, realistic proportions, stock photo style, offensive content"
}

Cenas pré-definidas para o Tipo 10:
- Carro das Bombas: muscle car, trunk full of missiles, 22h Friday, leaving casually
- Piscina do Caos: poolside with cigar and beer, market charts collapsing on screens behind, completely unbothered
- Churrasqueiro: BBQing with treaties burning in charcoal, beer in hand, advisors panicking in background
- Boliche: bowling, pins are countries, scoreboard shows consecutive strikes
- Sofá Casa Branca: presidential office couch channel surfing, TVs showing global panic, bored expression

---

## COMO USAR ESTE BANCO

1. Identificar o tipo de capa que combina com o tema
2. Escolher o modelo — LIMPO (só imagem) ou HEADLINE (imagem + texto)
3. Substituir [HEADLINE EM PT-BR AQUI] pela headline específica do carrossel
4. Para o Tipo 10, preencher [DESCREVER CENA/PALETA/ATMOSFERA]
5. Copiar o campo "prompt" para Midjourney, Flux ou Freepik
6. Usar o "text_overlay" como briefing para o designer no Canva/Figma
