# 🎠 CarrosselAI — OpenClaw Skill

> Engine completo de produção de carrosseis Instagram com IA. Da pesquisa à entrega em ~10 minutos.

[![OpenClaw Compatible](https://img.shields.io/badge/OpenClaw-Compatible-39FF14?style=flat-square)](https://openclaw.ai)
[![Nano Banana Pro](https://img.shields.io/badge/Nano_Banana_Pro-Powered-4285F4?style=flat-square)](https://clawhub.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## O que é?

Você fala o tema. A IA pesquisa, escreve o roteiro, gera as imagens, monta os slides e envia tudo pronto — sem Canva, sem Photoshop, sem horas perdidas.

```
Você: "Cria um carrossel sobre Bitcoin e inflação"

IA: pesquisa → roteiro → capas → imagens → render → entrega no Telegram
```

**Tempo total: ~8–12 minutos**

---

## Pré-requisitos

- [OpenClaw](https://openclaw.ai) instalado e funcionando
- Node.js 18+ (`node --version`)
- **Nano Banana Pro** instalado (`clawhub install nano-banana-pro`)
- API Key do Google — [obter aqui](https://aistudio.google.com)

---

## Geração de Imagens — Nano Banana Pro

As imagens são geradas pelo **Nano Banana Pro** (skill OpenClaw), que utiliza o **Google Imagen** — o modelo de geração de imagens do Google, calibrado para produzir capas e slides com identidade visual consistente.

> ⚠️ **Não recomendamos substituições** (Midjourney, DALL-E, Stable Diffusion etc.).
> O workflow de prompts desta skill foi desenvolvido e validado especificamente para o Imagen.
> Outros modelos produzirão resultados inconsistentes com o sistema de layouts.

### Instalando o Nano Banana Pro

```bash
clawhub install nano-banana-pro
```

Após instalar, configure sua API Key do Google:

```bash
# Via variável de ambiente
export GEMINI_API_KEY="sua-chave-aqui"

# Ou via 1Password (recomendado)
op item create --vault "MeuVault" --title "Google AI" credential="sua-chave-aqui"
```

Para obter sua API Key: [aistudio.google.com](https://aistudio.google.com) → "Get API Key" → "Create API Key"

---

## Instalação

### Via ClawHub (recomendado)
```bash
clawhub install nano-banana-pro   # dependência de imagens
clawhub install carrossel-ai      # esta skill
```

### Manual
```bash
git clone https://github.com/spanevello0x/carrossel-ai
cd carrossel-ai
bash setup.sh
```

---

## Configuração

Na primeira execução, o assistente faz 13 perguntas de setup (< 3 minutos):

1. Nome do seu perfil
2. @handle do Instagram
3. Nicho de atuação
4. Tom de voz
5. Idioma
6. Usar X (Twitter) como fonte?
7. Outras fontes de conteúdo
8. Badge de identificação (PNG)
9. Gerenciador de senhas (1Password ou .env)
10. API Key do Google (para Nano Banana Pro)
11. Canal de entrega (Telegram / WhatsApp / local)
12. Google Drive (opcional)
13. Modo autônomo vs semi-autônomo

Para refazer o setup a qualquer momento: `/carrossel-setup`

---

## Como usar

Após o setup, simplesmente diga ao seu assistente OpenClaw:

```
"Cria um carrossel sobre [tema]"
"Carrossel sobre [link de artigo]"
"Quero um carrossel explicando [conceito]"
```

---

## Custo estimado

| Item | Custo |
|------|-------|
| Por carrossel completo (10 slides + 5–6 imagens) | ~R$ 2,00 |
| 30 carrosseis/mês | ~R$ 60,00 |
| Render + entrega | Gratuito |

> 💡 Para reduzir custo: use 3 imagens contextuais por carrossel → ~R$ 1,20

O custo se refere ao uso da API do Google via Nano Banana Pro. Consulte a versão mais recente da skill em [clawhub.com](https://clawhub.com) para os modelos disponíveis e preços atualizados.

---

## Estrutura do Repositório

```
carrossel-ai/
├── SKILL.md               # Instrução principal da skill
├── render-carousel.js     # Engine de render (Puppeteer)
├── config.json.template   # Template de configuração
├── setup.sh               # Script de instalação
├── docs/
│   ├── SPEC.html          # Documentação visual completa
│   └── banco-capas.md     # Referência dos 10 tipos de capa
└── assets/
    ├── badge-black-example.png    # Exemplo de badge (fundo branco)
    └── badge-white-example.png    # Exemplo de badge (fundo preto)
```

---

## Documentação Completa

Abra `docs/SPEC.html` no seu navegador para a documentação visual interativa completa — tipos de slide, tipos de capa, imagens contextuais, CTAs, fluxo de execução e roadmap.

---

---

## Licença

MIT — use, modifique e distribua livremente.
