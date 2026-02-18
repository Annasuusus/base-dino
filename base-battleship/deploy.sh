#!/bin/bash
# Fix PATH and deploy to Vercel
set -e

# Load shell config (Node often added there)
[ -f "$HOME/.zshrc" ] && source "$HOME/.zshrc" 2>/dev/null
[ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc" 2>/dev/null

# Add common Node locations to PATH
export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
[ -s "$HOME/.fnm/fnm" ] && eval "$(fnm env)"
# Homebrew Apple Silicon
[ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"

if ! command -v node &>/dev/null; then
  echo "Node.js не знайдено. Встанови: https://nodejs.org"
  exit 1
fi

echo "Node: $(node -v)"
echo "npm: $(npm -v)"
cd "$(dirname "$0")"

echo "Installing..."
npm install

echo "Build..."
npm run build

echo "Deploy to Vercel..."
npx vercel --prod
