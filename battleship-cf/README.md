# Морський бій — Base Mini App (Cloudflare Pages)

Гра **працює** на Base, бо деплой на **Cloudflare Pages** — там шлях `/.well-known/farcaster.json` віддається нормально (на Vercel він зарезервований і не працює).

## Автодеплой через GitHub Actions (зроби один раз)

1. **Cloudflare:** [dash.cloudflare.com](https://dash.cloudflare.com) → профіль (праворуч) → **My Profile** → **API Tokens** → **Create Token** → шаблон **Edit Cloudflare Workers** або **Custom** з правами **Account** → **Cloudflare Pages: Edit** → Create Token. Скопіюй токен.
2. **Cloudflare Account ID:** Dashboard → обрати будь-який сайт/проєкт → права панель **API** → **Account ID**.
3. **GitHub:** репо **Annasuusus/base-dino** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - `CLOUDFLARE_API_TOKEN` — вставити токен з кроку 1
   - `CLOUDFLARE_ACCOUNT_ID` — вставити ID з кроку 2
4. Зберегти. Після цього кожен **push** у папку `battleship-cf` (або ручний запуск **Actions** → **Deploy battleship-cf to Cloudflare Pages** → **Run workflow**) зробить збірку і деплой на Cloudflare Pages.
5. Готовий URL: **https://battleship-cf.pages.dev** (проєкт створиться при першому деплої).

Опційно (для Base Verify): додай секрети `FARCASTER_HEADER`, `FARCASTER_PAYLOAD`, `FARCASTER_SIGNATURE` — тоді маніфест буде з заповненою accountAssociation.

---

## Деплой вручну на Cloudflare Pages (5 хвилин)

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
