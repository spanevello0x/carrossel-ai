---
name: carrossel-ai
description: "Engine completo para criar carrosseis Instagram com IA. Pesquisa fonte, escreve roteiro, gera imagens via Nano Banana Pro, renderiza slides e entrega no Telegram/WhatsApp — tudo em ~10 minutos."
version: "1.0.0"
---

# CarrosselAI Skill

## O que este skill faz

Você fornece um tema ou link. O assistente:
1. Pesquisa e extrai a fonte
2. Propõe 3 ângulos de abordagem
3. Gera roteiro completo (10 slides)
4. Gera 5 variações de capa + imagens contextuais via Nano Banana Pro
5. Renderiza os slides com Puppeteer
6. Entrega os PNGs + 3 variações de legenda

**Tempo total: ~8–12 minutos do brief à entrega.**

---

## SETUP INICIAL (primeira execução)

Quando o usuário usar o skill pela primeira vez, ou executar `/carrossel-setup`, fazer as seguintes perguntas em sequência e salvar as respostas em `skills/carrossel-ai/config.json`.

### Pergunta 1 — Nome do perfil
```
Qual é o seu nome ou nome do perfil no Instagram?
(Ex: "Maria | Finanças", "Lucas Marketing", "Ana Negócios")
```
Salvar em: `config.profile.name`

### Pergunta 2 — Handle
```
Qual é o seu @handle do Instagram?
(Ex: @maria.financas, @lucas.mkt)
```
Salvar em: `config.profile.handle`

### Pergunta 3 — Nicho
```
Qual é o seu nicho de atuação?

1. Marketing / Vendas
2. Negócios / Empreendedorismo
3. Finanças pessoais / Investimentos
4. Tecnologia / IA
5. Saúde / Bem-estar
6. Educação
7. Lifestyle / Desenvolvimento pessoal
8. Outro (descrever)
```
Salvar em: `config.profile.niche`

### Pergunta 4 — Tom de voz
```
Qual é o seu tom de voz padrão?

1. Provocador / Direto (choca, questiona, confronta)
2. Educativo / Didático (explica com paciência, usa exemplos)
3. Técnico / Analítico (dados, gráficos, profundidade)
4. Informal / Próximo (como conversa com amigo)
5. Formal / Institucional (sério, corporativo)
```
Salvar em: `config.profile.tone`

### Pergunta 5 — Idioma
```
Em qual idioma você produz conteúdo?
1. Português (Brasil)  [padrão]
2. English
3. Español
```
Salvar em: `config.profile.language`

### Pergunta 6 — Fonte Twitter/X
```
Você vai usar o X (Twitter) como fonte de conteúdo?
Isso permite que eu busque tweets e threads diretamente para criar carrosseis.

1. Sim — quero usar (vou configurar API depois)
2. Não — vou colar links ou texto manualmente  [padrão]
```
Salvar em: `config.sources.twitter` (true/false)

### Pergunta 7 — Outras fontes
```
Que tipos de fonte você vai usar para os carrosseis? (pode escolher mais de um)

1. Links de artigos/notícias (você cola a URL)
2. PDFs e relatórios
3. YouTube (você cola o link do vídeo)
4. Texto livre (você digita ou cola o resumo)
5. Pesquisa automática na web pelo tema
```
Salvar em: `config.sources.other`

### Pergunta 8 — Badge de identificação
```
Vai usar Badge de Identificação nos slides?

O badge é sua "assinatura visual" — aparece no topo de cada slide com sua
foto de perfil, nome e @handle.
```

Antes de continuar, enviar os dois arquivos de exemplo para o usuário visualizar:
- Enviar `skills/carrossel-ai/assets/badge-black-example.png` com legenda:
  "Exemplo: badge-black.png → usado nos slides brancos (texto + imagem)"
- Enviar `skills/carrossel-ai/assets/badge-white-example.png` com legenda:
  "Exemplo: badge-white.png → usado nos slides pretos e na capa"

Depois continuar com o texto:
```
São necessárias 2 versões (como nos exemplos acima):
  • badge-black.png → para slides de fundo BRANCO (texto escuro)
  • badge-white.png → para slides de fundo PRETO (texto claro / capa / CTA)

Requisitos do arquivo PNG:
  ✅ Fundo TRANSPARENTE (alpha) — nunca fundo branco/preto
  ✅ Tamanho mínimo: 400×80px (formato horizontal)
  ✅ Conteúdo: foto circular + nome + @handle
  ✅ Exportar do Figma, Canva (PNG transparente) ou Photoshop
  ❌ Nunca usar JPG (não tem transparência)

1. Sim — vou enviar meus 2 PNGs agora  [recomendado]
2. Sim — quero que a IA gere automaticamente (usando nome + @handle configurados)
3. Não por agora — usar badge genérico de exemplo
```
Se escolher opção 1: solicitar upload de `badge-black.png` e `badge-white.png`, salvar em `skills/carrossel-ai/assets/`.
Se escolher opção 2: gerar badge usando nome + handle configurados via Puppeteer (mesmo método dos exemplos).
Se escolher opção 3: copiar `badge-black-example.png` e `badge-white-example.png` como badge padrão.
Salvar em: `config.badge.enabled`, `config.badge.black_path`, `config.badge.white_path`

### Pergunta 9 — Gerenciador de senhas
```
Você usa o 1Password como gerenciador de senhas e credenciais?

Com 1Password: suas chaves de API ficam no cofre seguro. O assistente
busca automaticamente com "op read" — zero exposição.

Sem 1Password: as chaves ficam em variável de ambiente (.env) ou
no config.json local. Simples e funciona normalmente.

1. Sim — uso 1Password (informar nome do vault)
2. Não — prefiro variável de ambiente (.env)
3. Não sei / não uso gerenciador
```
Se opção 1: salvar vault name em `config.credentials.onepassword_vault`
Se opção 2 ou 3: usar `process.env.GEMINI_API_KEY`
Salvar em: `config.credentials.manager` ("1password" | "env")

### Pergunta 10 — API do Google Gemini
```
Agora precisamos da sua API Key do Google para o Nano Banana Pro.

As imagens são geradas pelo Nano Banana Pro — skill OpenClaw que usa os
modelos de imagem do Google. Não recomendamos substituições (Midjourney,
DALL-E, etc.) pois o workflow foi calibrado para esses modelos.

Como obter sua API Key:
  1. Acesse: aistudio.google.com
  2. Faça login com sua conta Google
  3. Clique em "Get API Key" no menu lateral
  4. Clique em "Create API Key"
  5. Copie a chave gerada

Cole sua API Key aqui:
```
Se 1Password: salvar referência no vault configurado e armazenar path em config.
Se .env: adicionar `GEMINI_API_KEY=suachave` no arquivo `.env` da skill.
Salvar em: `config.credentials.gemini_env_var`

### Pergunta 11 — Canal de entrega
```
Onde quer receber os slides prontos após o render?

1. Telegram (informar Chat ID e Topic ID se usar tópicos)  [recomendado]
2. WhatsApp
3. Só salvar localmente na pasta output/
```
Salvar em: `config.delivery.channel`, `config.delivery.telegram_chat_id`, etc.

### Pergunta 12 — Google Drive
```
Quer arquivar os carrosseis no Google Drive automaticamente?

Cada carrossel será salvo em uma pasta organizada por data/tema.
Útil para manter histórico e acessar de qualquer dispositivo.

1. Sim — informar ID da pasta no Drive
2. Não por agora  [padrão]
```
Salvar em: `config.storage.google_drive`, `config.storage.drive_folder_id`

### Pergunta 13 — Modo de operação
```
Prefere controlar o processo ou receber tudo automático?

──────────────────────────────────────────
🔀 SEMI-AUTÔNOMO [recomendado para começar]
──────────────────────────────────────────
Você participa de cada decisão antes de avançar:

  ① Proposta de 3 ângulos → você escolhe
  ② Roteiro gerado → você revisa
  ③ 5 opções de capa → você escolhe a favorita
  ④ Imagens contextuais → você aprova ou pede ajuste
  ⑤ Copy (legendas + CTA) → você revisa antes de renderizar

Ideal para validar estilo, voz e identidade visual nas primeiras rodadas.
Depois de calibrado, você pode migrar para o modo autônomo.

──────────────────────────────────────────
⚡ AUTÔNOMO TOTAL
──────────────────────────────────────────
Você fala o tema. O assistente faz tudo e entrega pronto.

  • Escolhe o ângulo mais forte automaticamente
  • Gera todas as imagens sem pedir aprovação
  • Renderiza e envia os slides finalizados

  ⏱ Tempo estimado informado no início de cada execução
  📡 Pings de progresso enviados a cada etapa da geração de imagens
     (você sabe exatamente onde está o processo, sem ficar no escuro)

Use após validar que o estilo está do jeito que você quer.

──────────────────────────────────────────

1. Semi-autônomo — quero controlar cada etapa  [padrão]
2. Autônomo total — entrega sem me perguntar
```
Salvar em: `config.mode` ("semi-auto" | "auto")

### Confirmação final
```
✅ Configuração salva!

Perfil: [nome] (@handle)
Nicho: [nicho]
Tom: [tom de voz]
Modo: [semi-auto / auto]
Imagens: Nano Banana Pro (Google)
Entrega: [canal configurado]

Agora é só dizer: "Cria um carrossel sobre [tema]"

Para mudar qualquer configuração depois, use /carrossel-setup
Custo estimado: ~R$2 por carrossel completo
```

---

## FLUXO DE EXECUÇÃO (6 passos)

### 🚦 INÍCIO DE EXECUÇÃO — MODO AUTÔNOMO (obrigatório)

**Sempre que o modo for `auto`, antes de iniciar qualquer passo:**

1. Calcular e informar o tempo estimado total:
```
⚡ Modo autônomo ativado.

Tema: [tema]
Etapas: pesquisa → roteiro → 5 capas → [N] imagens contextuais → render → entrega
⏱ Tempo estimado: ~[X–Y] minutos

Iniciando agora... acompanhe os pings de progresso abaixo.
```

2. Estimativa de tempo por etapa (usar para calcular o total):
   - Pesquisa + roteiro: ~1–2 min
   - Cada imagem gerada (Nano Banana Pro): ~1–2 min
   - 5 capas + imagens contextuais (média 4): ~9–18 min total de imagens
   - Render + entrega: ~1 min
   - **Total típico: 12–22 minutos**

3. Enviar **ping de progresso** a cada imagem gerada durante o Passo 5:
```
📸 Capa [1/5] gerada ✅
📸 Capa [2/5] gerada ✅
...
📸 Capa [5/5] gerada ✅
🖼 Imagem contextual [1/4] gerada ✅
🖼 Imagem contextual [2/4] gerada ✅
...
🎬 Todas as imagens prontas. Iniciando render...
```

**Regra:** nunca sumir por mais de 2 minutos sem enviar um ping. Se uma imagem demorar mais que o normal, notificar:
```
⏳ Gerando imagem [N]... (pode levar mais ~1 min)
```

---

### PASSO 1 — Pesquisa da Fonte

Identificar o tipo de entrada:
- **URL de artigo/notícia** → usar `web_fetch` para extrair o conteúdo
- **Link do Twitter/X** → usar `web_fetch` ou bird CLI se configurado
- **Link do YouTube** → extrair transcrição via youtube-api skill se disponível
- **Texto livre / resumo** → usar diretamente como base
- **Tema sem fonte** → usar `web_search` para encontrar dados relevantes e recentes

Extrair: dado principal, fonte/autor, contexto, números relevantes. Usar como base para os ângulos.

---

### PASSO 2 — Propor 3 Ângulos

Antes de gerar qualquer slide, apresentar **3 ângulos diferentes** para o tema. Cada ângulo com:
- **Nome do ângulo** (ex: "Revelação/Storytelling", "Dado Chocante", "Contrarian")
- **Gancho de capa** (1-2 linhas de impacto)
- **Linha narrativa** (o que o carrossel vai contar)

```
ÂNGULO 1 — [Nome]
Capa: "[FRASE DE IMPACTO]"
Narrativa: [O que o carrossel vai explorar]

ÂNGULO 2 — [Nome]
Capa: "[FRASE DE IMPACTO]"
Narrativa: [O que o carrossel vai explorar]

ÂNGULO 3 — [Nome]
Capa: "[FRASE DE IMPACTO]"
Narrativa: [O que o carrossel vai explorar]
```

**Modo semi-auto:** aguardar escolha do usuário (1, 2 ou 3) antes de continuar.
**Modo auto:** escolher o ângulo mais forte e continuar automaticamente.

---

### PASSO 3 — Confirmar CTA (semi-auto) ou Gerar CTA (auto)

**Modo semi-auto:**
```
Qual CTA você quer no último slide?

1. Seguir o perfil (contextualizado com o tema)
2. Salvar/Notificações
3. Engajamento com pergunta
4. CTA personalizado (descrever)
```

**Modo auto:** gerar CTA contextualizado com a narrativa do carrossel.

**Regras do CTA (obrigatórias):**
- ❌ NUNCA usar frase genérica ("Segue o perfil e compartilha")
- ✅ Contextualizar com o tema — o CTA deve fazer sentido após o carrossel
- ✅ Máximo 4 linhas. Cada linha = frase curta e completa (3–7 palavras)
- ❌ NUNCA quebrar uma frase no meio entre duas linhas
- ❌ NUNCA mencionar nome de produto, comunidade ou clube
- ✅ CTA promove o perfil pessoal do criador

---

### PASSO 4 — Gerar Roteiro Completo

Após confirmação, gerar o roteiro completo.

#### Estrutura dos slides

```
CAPA         — Imagem + headline de impacto
SLIDE 1      — Gancho (expande a promessa da capa)
SLIDE 2-3    — Contexto (o que aconteceu / qual o problema)
SLIDE 4-6    — Análise (por que importa + dados)
SLIDE 7-8    — Implicações (o que muda pra você)
SLIDE 9      — Ação (o que fazer — prático)
SLIDE 10     — CTA
```

#### Dois tipos de slide

**SLIDE CERNE (`texto_cheio`)** — 4+ linhas de conteúdo:
- Texto ocupa 100% do slide
- Máximo 8 linhas
- Sem imagem

**SLIDE CURTO (`texto_curto_imagem`)** — até 3 linhas:
- Texto compacto
- Imagem contextual gerada embaixo
- Sinalizar antes do bloco com `📌 SLIDE CURTO`

**Regra de densidade:** se um slide tem 4 ou mais linhas, usar `texto_cheio` mesmo que seja um "slide de transição". Prioridade: legibilidade.

#### Alternância obrigatória

Os slides DEVEM alternar entre densos e leves:
```
CAPA → CURTO → CERNE → CURTO → CERNE → CURTO → ...
```
Se dois cernes seguidos forem inevitáveis, inserir um slide de transição curto entre eles.

#### Regras de formatação

- 1 ideia por slide
- Frases curtas e diretas — cada linha é uma ideia
- **CAIXA ALTA** para palavras-chave de impacto (não frases inteiras)
- `**negrito**` em números, valores, percentuais, termos-chave
- ❌ NUNCA usar setas (`→`, `->`) em nenhum slide
- ❌ NUNCA usar traços (`—`) como separador
- ❌ NUNCA colocar orientações de layout dentro do texto do slide
- ✅ `\n` entre parágrafos distintos ou bullets — NUNCA no meio de uma frase contínua
- Corpo do slide = texto final puro, pronto para render

---

### PASSO 5 — Gerar Imagens (Nano Banana Pro)

#### 5a — 5 variações de capa

Para cada variação, entregar:
1. Nome do conceito + gatilho emocional
2. Descritivo da imagem
3. Headline em CAIXA ALTA em PT-BR (ou idioma configurado)
4. JSON completo para Nano Banana Pro

Regras da capa:
- **Formato: 4:5** (vertical, Instagram)
- **Resolução: 2K**
- Elemento principal no terço superior da imagem
- Gradiente escuro no terço inferior (para o texto sobreposto)
- Máximo 3 elementos visuais na cena
- Sem texto embutido na imagem (o texto vai como overlay no render)
- ❌ Sem logos, marcas ou textos reconhecíveis

JSON de capa (formato obrigatório):
```json
{
  "prompt": "...",
  "text_overlay": {
    "headline": "TEXTO EM CAIXA ALTA",
    "position": "bottom_left",
    "color": "#FFE500",
    "accent_color": "#e05252"
  },
  "format": {
    "aspect_ratio": "4:5",
    "resolution": "2K"
  },
  "negative_prompt": "text, watermark, logo, brand, blurry, dark center, light bottom"
}
```

Posições disponíveis: `bottom_left`, `centered`, `bottom_center`, `crescente`

#### 5b — Imagens contextuais (slides curtos)

Para cada `📌 SLIDE CURTO` do roteiro, gerar 1 imagem contextual.

Regras obrigatórias (validadas em produção):
- **Proporção livre** — gerar na proporção natural do conteúdo: 3:2 landscape para prints/notícias, 1:1 para conceituais. O engine calcula a altura do container automaticamente via `sharp` (lê o aspect ratio real da imagem)
- **Composição TIGHT** — elemento principal ocupa 70–80% do frame
- **SEM gradiente escuro** — regra exclusiva da capa
- Imagem conceitual/metafórica — não literal
- Cada slide curto = imagem própria e única
- ❌ NUNCA reutilizar a capa como imagem contextual
- ❌ NUNCA reutilizar a mesma imagem em mais de um slide

**Como o engine renderiza as imagens contextuais:**
- O `render-carousel.js` usa `sharp` para ler as dimensões reais de cada imagem local
- A altura do container é calculada como: `largura (956px) × (altura_img / largura_img)`, com cap de 700px
- A imagem renderiza com `object-fit: contain` — aparece inteira, sem corte e sem margens
- Funciona corretamente para qualquer proporção: landscape (print), quadrado (conceitual) ou portrait

JSON de imagem contextual:
```json
{
  "prompt": "...",
  "format": {
    "aspect_ratio": "3:2",
    "resolution": "1K"
  },
  "negative_prompt": "text, watermark, logo, wide shot, empty background, gradient fade to black"
}
```

Gerar imagens com **Nano Banana Pro** (`clawhub install nano-banana-pro`):
```bash
# Ler API Key conforme configuração
# Se 1Password:
GEMINI_API_KEY=$(op read "op://VAULT_NAME/ITEM/credential")
# Se .env:
source skills/carrossel-ai/.env

# Gerar imagem via Nano Banana Pro
GEMINI_API_KEY="$GEMINI_API_KEY" uv run ~/.npm-global/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py \
  --prompt "PROMPT_AQUI" \
  --filename "slideXX-nome.png" \
  --aspect-ratio "3:2" \
  --resolution 1K
```

> ⚠️ Instale sempre a versão mais recente do Nano Banana Pro via `clawhub install nano-banana-pro`.
> O modelo Imagen utilizado pode evoluir — consulte o changelog da skill para a versão ativa.

---

### PASSO 6 — Render + Entrega

#### 6a — Montar input.json

Criar `/tmp/carrossel-{tema}-{data}/input.json`:

```json
{
  "carrossel_id": "tema-YYYY-MM-DD",
  "output_dir": "/tmp/carrossel-tema",
  "badge_black": "skills/carrossel-ai/assets/badge-black.png",
  "badge_white": "skills/carrossel-ai/assets/badge-white.png",
  "slides": [
    {
      "slide": "Capa",
      "type": "capa",
      "headline": "HEADLINE EM CAIXA ALTA",
      "image_url": "/path/to/capa.png"
    },
    {
      "slide": "Slide_01",
      "type": "texto_curto_imagem",
      "text": "Texto curto do slide\n\nSegunda ideia",
      "image_url": "/path/to/slide01-img.png"
    },
    {
      "slide": "Slide_02",
      "type": "texto_cheio",
      "text": "Texto longo do slide cerne\n\n**Dado importante:** número\n\nOutra linha"
    },
    {
      "slide": "Slide_10",
      "type": "cta_preto",
      "headline": "HEADLINE DO CTA",
      "text": "Frase curta de CTA.\nSegunda linha do CTA.\nMe segue pra não perder."
    }
  ]
}
```

**Tipos disponíveis:**
| Tipo | Uso | Background |
|------|-----|-----------|
| `capa` | Capa (image + headline) | Full bleed image |
| `texto_curto_imagem` | Slide curto + imagem | Branco |
| `texto_cheio` | Slide cerne / texto denso | Branco |
| `cta_preto` | CTA final | Preto |

**Rich text no campo `text`:**
- `**negrito**` → Inter Bold
- `\n` → quebra de linha (entre bullets ou parágrafos distintos — NUNCA no meio de frase)

#### 6b — Renderizar

```bash
cd ~/.openclaw/workspace
node scripts/render-carousel.js /tmp/carrossel-tema/input.json
# Gera: /tmp/carrossel-tema/Capa.png, Slide_01.png ... Slide_10.png
```

**Parâmetros do render (render-carousel.js):**
- `object-fit: contain` + `object-position: center center` — imagem aparece inteira, sem corte
- Altura do container calculada automaticamente via `sharp` (aspect ratio real da imagem)
- `background: #FFFFFF` no container das imagens contextuais
- `border-radius: 16px` nas imagens contextuais
- Badge preto nos slides brancos (`texto_cheio` e `texto_curto_imagem`)
- Badge branco na capa e CTA

#### 6c — Entregar

Copiar para diretório permitido:
```bash
mkdir -p ~/.openclaw/workspace/skills/carrossel-ai/output
cp /tmp/carrossel-tema/*.png ~/.openclaw/workspace/skills/carrossel-ai/output/
```

Enviar via `message` tool conforme canal configurado:
- **Telegram:** `message(action="send", target="CHAT_ID", threadId="TOPIC_ID", filePath="PATH", caption="Slide X")`
- **WhatsApp:** `message(action="send", channel="whatsapp", target="NUMERO", media="PATH")`

Enviar na ordem: Capa → Slide_01 → ... → Slide_10

#### 6d — Legendas

Após os slides, enviar as 3 variações de legenda em mensagem separada:

```
📝 LEGENDAS

— LEGENDA 1 (Storytelling) —
[texto da legenda 1]

— LEGENDA 2 (Provocação/Dado) —
[texto da legenda 2]

— LEGENDA 3 (Educativa) —
[texto da legenda 3]
```

#### 6e — Upload Google Drive (se configurado)

Se `config.storage.google_drive = true`:
```bash
FOLDER_ID=$(cat skills/carrossel-ai/config.json | jq -r '.storage.drive_folder_id')
# Criar subpasta: "YYYY-MM-DD — Tema"
# Upload de todos os PNGs + legendas.txt
```

---

## GERAÇÃO DAS 3 LEGENDAS

Sempre gerar ao final (após confirmação do roteiro). Cada legenda com estilo diferente:

- **LEGENDA 1 — Storytelling:** narrativa que acompanha a jornada dos slides
- **LEGENDA 2 — Provocação/Dado:** abre com número ou fato chocante, desafia
- **LEGENDA 3 — Educativa/Direta:** explica o valor do conteúdo objetivamente

Cada legenda:
- 150–300 palavras
- Terminar com o CTA contextualizado
- Linguagem do tom de voz configurado
- Não repetir o conteúdo dos slides — complementar

---

## REGRAS PERMANENTES

### Imagens contextuais
- ✅ Proporção: 3:2 landscape para prints/notícias, 1:1 para conceituais
- ✅ Elemento principal: 70–80% do frame
- ✅ Engine usa `sharp` para calcular altura do container pelo ratio real da imagem
- ✅ `object-fit: contain` — imagem inteira, sem corte, sem margens
- ✅ Background container: `#FFFFFF`
- ❌ Sem gradiente escuro
- ❌ Nunca reutilizar capa ou outra imagem contextual
- ❌ Nunca usar `object-fit: cover` nas imagens contextuais (causava corte)

### Texto dos slides
- ❌ Nunca traços (—) como separador
- ❌ Nunca setas (→) de nenhum tipo
- ❌ Nunca orientações de layout dentro do texto do slide
- ❌ Nunca `\n` no meio de frase contínua
- ✅ 4+ linhas → `texto_cheio` (sem imagem)
- ✅ 3 linhas ou menos → `texto_curto_imagem` + imagem exclusiva

### CTA
- ❌ Nunca genérico ("Segue o perfil e compartilha")
- ✅ Sempre contextualizado com o tema do carrossel
- ✅ Promove o perfil pessoal — nunca produto/comunidade

### Fear & Greed (se usar)
- ✅ Dado de suporte — máximo 1x por carrossel
- ❌ Nunca como ângulo central

---

## COMANDOS DISPONÍVEIS

| Comando | Ação |
|---------|------|
| `Cria um carrossel sobre [tema]` | Inicia o fluxo completo |
| `Carrossel sobre [URL]` | Usa a URL como fonte |
| `/carrossel-setup` | Refaz a configuração inicial |
| `/carrossel-status` | Mostra configuração atual |
| `/carrossel-help` | Exibe este guia resumido |

---

## REFERÊNCIAS

- **Tipos de capa:** `docs/banco-capas.md`
- **Documentação visual:** `docs/SPEC.html`
- **Render engine:** `render-carousel.js`
- **Configuração:** `config.json`

---

*Consulte sempre a versão mais recente do Nano Banana Pro: `clawhub install nano-banana-pro`*
