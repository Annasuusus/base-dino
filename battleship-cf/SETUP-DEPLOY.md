# Як запушити workflow і отримати посилання

Workflow лежить у **`battleship-cf/workflow-deploy.yml`** (без коментаря в першому рядку — це той самий вміст для `.github/workflows/`).

## 1. Додати workflow на GitHub (один раз)

У терміналі (або в Cursor після цього кроку):

```bash
cd "/Users/illumination/Desktop/КУРСОР"
mkdir -p .github/workflows
cp battleship-cf/workflow-deploy.yml .github/workflows/deploy-battleship-cf.yml
# Видали перший рядок (коментар) у .github/workflows/deploy-battleship-cf.yml
git add .github/workflows/deploy-battleship-cf.yml
git commit -m "ci: add deploy workflow"
git push origin main
```

Або вручну: на GitHub у репо створи файл **`.github/workflows/deploy-battleship-cf.yml`** і встав туди вміст з **`battleship-cf/workflow-deploy.yml`** (без першого рядка з коментарем).

## 2. Додати секрети в репо

GitHub → **Annasuusus/base-dino** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

| Name | Value |
|------|--------|
| `CLOUDFLARE_API_TOKEN` | Токен з [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens) (Create Token → **Edit Cloudflare Workers** або **Cloudflare Pages: Edit**) |
| `CLOUDFLARE_ACCOUNT_ID` | У Cloudflare Dashboard → права панель → **API** → **Account ID** |

## 3. Запустити деплой

- **Actions** → **Deploy battleship-cf to Cloudflare Pages** → **Run workflow** → Run workflow  
або зроби будь-яку зміну в папці `battleship-cf` і push — деплой піде автоматично.

## 4. Посилання на гру

Після успішного деплою: **https://battleship-cf.pages.dev**
