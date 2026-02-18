# Морський бій — Base Mini App (Cloudflare Pages)

Гра **працює** на Base, бо деплой на **Cloudflare Pages** — там шлях `/.well-known/farcaster.json` віддається нормально (на Vercel він зарезервований і не працює).

## Деплой на Cloudflare Pages (5 хвилин)

1. Зайди на [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.

2. Обери репо (наприклад `Annasuusus/base-dino`).  
   **Root directory:** вкажи **`battleship-cf`** (саме ця папка).

3. **Build settings:**
   - **Framework preset:** Next.js (Static Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`

4. **Environment variables** (перед першим деплоєм додай):
   - `NEXT_PUBLIC_APP_URL` = **твій URL** (після деплою буде типу `https://battleship-cf.pages.dev`)
   - Після Verify на Base додай: `FARCASTER_HEADER`, `FARCASTER_PAYLOAD`, `FARCASTER_SIGNATURE`

5. **Save** → деплой піде автоматично. Скопіюй **URL проєкту** (наприклад `https://battleship-cf-xxx.pages.dev`).

6. На [base.dev/preview](https://www.base.dev/preview) → **App URL** = цей URL → **Submit** → **Verify & Add URL** (мета-тег `base:app_id` вже в коді). Потім **Account association** → Verify → скопіюй header, payload, signature в env на Cloudflare і зроби **Retry deployment**.

7. Перевір: `https://ТВІЙ-URL/.well-known/farcaster.json` — має віддавати JSON з `accountAssociation` і `miniapp`.

## Локально

```bash
cd battleship-cf
npm install
npm run dev
```

Відкрий http://localhost:3002 — головна, кнопка «Грати» → гра.

## Чому саме Cloudflare Pages

На **Vercel** шлях `/.well-known` зарезервований: ні rewrites, ні статичні файли з цієї папки там не працюють. На **Cloudflare Pages** статичний файл `public/.well-known/farcaster.json` копіюється в `out/` при `next build` і спокійно віддається за `/.well-known/farcaster.json`, тому Base бачить маніфест і все працює.
