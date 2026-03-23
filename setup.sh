#!/bin/bash
# CarrosselAI — Script de Instalação
# Uso: bash setup.sh

set -e

SKILL_DIR="$HOME/.openclaw/workspace/skills/carrossel-ai"
SCRIPTS_DIR="$HOME/.openclaw/workspace/scripts"
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${CYAN}🎠 CarrosselAI — Instalação${NC}"
echo "=================================="
echo ""

# 1. Verificar Node.js
echo -e "${YELLOW}[1/5]${NC} Verificando Node.js..."
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js não encontrado.${NC}"
  echo "   Instale em: https://nodejs.org (versão 18+)"
  exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"

# 2. Verificar OpenClaw workspace
echo -e "${YELLOW}[2/5]${NC} Verificando OpenClaw workspace..."
if [ ! -d "$HOME/.openclaw/workspace" ]; then
  echo -e "${RED}❌ OpenClaw workspace não encontrado em ~/.openclaw/workspace${NC}"
  echo "   Verifique se o OpenClaw está instalado."
  exit 1
fi
echo -e "${GREEN}✅ OpenClaw workspace encontrado${NC}"

# 3. Instalar Puppeteer
echo -e "${YELLOW}[3/5]${NC} Instalando Puppeteer (render engine)..."
cd "$HOME/.openclaw/workspace"
if [ ! -d "node_modules/puppeteer" ]; then
  npm install puppeteer --save-quiet
  echo -e "${GREEN}✅ Puppeteer instalado${NC}"
else
  echo -e "${GREEN}✅ Puppeteer já instalado${NC}"
fi

# 4. Copiar arquivos da skill
echo -e "${YELLOW}[4/5]${NC} Copiando arquivos para ~/.openclaw/workspace/skills/carrossel-ai..."
mkdir -p "$SKILL_DIR/assets"
mkdir -p "$SKILL_DIR/docs"
mkdir -p "$SKILL_DIR/output"

# Copiar SKILL.md
cp "$(dirname "$0")/SKILL.md" "$SKILL_DIR/SKILL.md"

# Copiar render script
cp "$(dirname "$0")/render-carousel.js" "$SCRIPTS_DIR/render-carousel.js"

# Copiar config template (só se não existir)
if [ ! -f "$SKILL_DIR/config.json" ]; then
  cp "$(dirname "$0")/config.json.template" "$SKILL_DIR/config.json"
  echo "   → config.json criado (execute /carrossel-setup para configurar)"
fi

# Copiar assets de exemplo
cp "$(dirname "$0")/assets/"*.png "$SKILL_DIR/assets/" 2>/dev/null || true

# Copiar documentação
cp "$(dirname "$0")/docs/"* "$SKILL_DIR/docs/" 2>/dev/null || true

echo -e "${GREEN}✅ Arquivos instalados em $SKILL_DIR${NC}"

# 5. Verificar API Key
echo -e "${YELLOW}[5/5]${NC} Verificando API Key do Google Gemini..."
if [ -z "$GEMINI_API_KEY" ]; then
  echo -e "${YELLOW}⚠️  GEMINI_API_KEY não encontrada no ambiente.${NC}"
  echo ""
  echo "   Para configurar, adicione ao seu ~/.bashrc ou ~/.zshrc:"
  echo "   export GEMINI_API_KEY=\"sua-chave-aqui\""
  echo ""
  echo "   Obter API Key gratuita: https://aistudio.google.com"
  echo ""
  echo "   Ou configure via 1Password (será perguntado no setup)."
else
  echo -e "${GREEN}✅ GEMINI_API_KEY encontrada${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Instalação concluída!${NC}"
echo ""
echo "   Próximo passo: diga ao seu assistente OpenClaw:"
echo "   ${CYAN}\"Configure o carrossel AI\"${NC} ou ${CYAN}\"/carrossel-setup\"${NC}"
echo ""
echo "   Documentação: abra ${CYAN}$SKILL_DIR/docs/SPEC.html${NC} no navegador"
echo ""
