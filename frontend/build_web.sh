#!/usr/bin/env bash
set -e

echo "========================================================"
echo "🚀 MathCity AI — Flutter Web Production Build Pipeline"
echo "========================================================"

# If flutter command is missing in build environment, install it
if ! command -v flutter &> /dev/null; then
  echo "📦 Flutter SDK topilmadi, stable versiya yuklanmoqda..."
  git clone https://github.com/flutter/flutter.git -b stable --depth 1 /tmp/flutter
  export PATH="/tmp/flutter/bin:$PATH"
fi

echo "ℹ️ Flutter versiyasi:"
flutter --version

echo "📦 Bog'liqliklar yuklanmoqda (flutter pub get)..."
flutter pub get

API_URL="${API_BASE_URL:-https://mathcity-ai-api.onrender.com}"
echo "🌐 Ishlab chiqarish API manzili: $API_URL"

flutter build web --release \
  --dart-define=API_BASE_URL="$API_URL"

echo "✅ MathCity AI Flutter Web ishlab chiqarishga tayyor (build/web)!"
