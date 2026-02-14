# Як розгорнути Морський бій онлайн

## Варіант 1: Vercel (рекомендовано)

1. **Зареєструйся на [vercel.com](https://vercel.com)** (безкоштовно, можна через GitHub).

2. **Завантаж проєкт:**
   - Зайди на [vercel.com/new](https://vercel.com/new)
   - Якщо проєкт у GitHub: підключи репозиторій і вкажи **Root Directory** → `base-battleship`
   - Або: встанови Vercel CLI (`npm i -g vercel`), перейди в папку проєкту і запусти:
     ```bash
     cd base-battleship
     vercel
     ```

3. **Змінна оточення (опційно, але бажано):**
   - У налаштуваннях проєкту Vercel → Settings → Environment Variables
   - Додай: `AUTH_SECRET` = будь-який довгий випадковий рядок (для безпечної авторизації гаманця)

4. Після деплою отримаєш посилання типу `https://base-battleship-xxx.vercel.app`

---

## Варіант 2: Netlify

1. Зареєструйся на [netlify.com](https://netlify.com)
2. New site → Import from Git або drag & drop папки `base-battleship`
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Для Next.js на Netlify може знадобитися плагін `@netlify/plugin-nextjs`

---

## Варіант 3: Власний сервер

```bash
cd base-battleship
npm install
npm run build
AUTH_SECRET=твій-секрет npm run start
```

Сервер працюватиме на порту 3001.
