#!/bin/bash
set -e

echo "🚀 در حال شروع فرآیند به‌روزرسانی و دیپلوی زنده..."

echo "📦 اضافه کردن تغییرات به Git..."
git add .

echo "📝 ثبت Commit..."
git commit -m "seo: update sitemap domain to siavashstudio.ir & polish architectural content terms" || echo "⚠️ تغییری برای commit یافت نشد."

echo "⬆️ ارسال تغییرات به GitHub..."
git push origin main

echo "🌐 دیپلوی مستقیم روی Production Vercel..."
npx vercel --prod

echo "✅ تمامی تغییرات با موفقیت روی siavashstudio.ir منتشر شد!"

