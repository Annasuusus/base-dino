# Деплой Морський бій → Base App

## 0. Маніфест

- **Rewrite** `/.well-known/farcaster.json` → `/api/farcaster-manifest` (next.config + vercel.json)
- **Static fallback:** `public/.well-known/farcaster.json` (генерується при build)

**Якщо 404 на Vercel:** Vercel може блокувати `.well-known`. Альтернатива — [Cloudflare Pages](https://pages.cloudflare.com/): підключи репо, Root = `base-battleship`, Build = `npm run build`, Framework = Next.js.

## 1. Git автор (обовʼязково!)

```bash
git config --global user.name "YourName"
git config --global user.email "***@users.noreply.github.com"
```

## 2. Vercel — вимкнути Deployment Protection

Vercel Dashboard → проект mygame-iota-one → **Settings** → **Deployment Protection** → **Vercel Authentication** → **Off** → Save.

Без цього Base не зможе доступитись до `/.well-known/farcaster.json`.

## 3. Env змінні на Vercel

Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_APP_URL` | `https://mygame-iota-one.vercel.app` |
| `FARCASTER_HEADER` | *(порожньо спочатку, додати після Verify)* |
| `FARCASTER_PAYLOAD` | *(порожньо спочатку)* |
| `FARCASTER_SIGNATURE` | *(порожньо спочатку)* |

## 4. Push і деплой

```bash
git add -A && git commit -m "fix: manifest for Base" && git push
```

Або пустий коміт з правильним автором:
```bash
git commit --allow-empty -m "vercel deploy" --author="YourName <***@users.noreply.github.com>"
git push
```

## 5. Account Association

1. Переконайсь, що деплой живий і `https://mygame-iota-one.vercel.app` відкривається
2. Перейди на [base.dev/preview](https://www.base.dev/preview?tab=account)
3. Встав `https://mygame-iota-one.vercel.app` в App URL → Submit
4. Натисни **Verify** і пройди інструкції
5. Скопіюй `accountAssociation` (header, payload, signature)
6. Додай їх у Vercel env: `FARCASTER_HEADER`, `FARCASTER_PAYLOAD`, `FARCASTER_SIGNATURE`
7. Redeploy (або push будь-якої зміни)

## 6. Перевірка

- `https://mygame-iota-one.vercel.app/.well-known/farcaster.json` — має віддавати JSON
- base.dev/preview → Metadata tab — без помилок
