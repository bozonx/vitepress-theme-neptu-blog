# 🏗️ Build-Time Analytics

Система интеграции аналитики во время сборки (build time) для статических сайтов на базе VitePress. Статистика запрашивается один раз при сборке и встраивается напрямую в статические файлы страниц (Data Loaders).

## 🎯 Преимущества Build-Time подхода

- ⚡ **Быстрая загрузка** - нет клиентских запросов к API Google во время работы сайта.
- 🔒 **Безопасность** - приватные ключи (credentials) используются только на сервере при сборке и не попадают в продакшен-бандл.
- 📦 **Статичность** - полностью статический сайт (SSG).
- 💰 **Экономия** - нет риска превысить лимиты API из-за наплыва пользователей.

## 🔧 Как это работает

1. **Во время сборки** (`npm run build`):
   - Система читает переменные окружения с доступами.
   - Запрашивает статистику по просмотрам из Google Analytics 4 (GA4).
   - "Впекает" (подмешивает) полученные данные напрямую в объекты `post` (через механизм data loaders VitePress).

2. **Во время работы сайта**:
   - Компоненты сайта используют заранее подготовленные данные из объектов `post.analyticsStats` для сортировки и отображения.

## ⚙️ Настройка Google Analytics 4

Для того чтобы система могла забрать данные из GA4, вам потребуется настроить сервисный аккаунт:

1. Зайдите в [Google Cloud Console](https://console.cloud.google.com/).
2. Создайте **Service Account** (Сервисный аккаунт).
3. Создайте новый ключ для этого аккаунта в формате **JSON** и скачайте его.
4. Откройте скачанный JSON и скопируйте `client_email`.
5. Перейдите в панель администратора вашей **Google Analytics 4**.
6. Добавьте скопированный email в список пользователей и выдайте ему права **Viewer (Читатель)**.

### Переменные окружения

Для безопасности мы используем переменные окружения. **Никогда не коммитьте ваш JSON-ключ в репозиторий!**

Создайте файл `.env` (или настройте секреты в CI/CD):

```bash
# ID вашего ресурса в GA4 (находится в админке GA -> Property Settings)
GA_PROPERTY_ID=123456789

# Полное содержимое скачанного JSON-файла в виде одной строки.
# Для локальной разработки вы можете просто скопировать содержимое файла сюда.
GA_CREDENTIALS_JSON='{"type": "service_account", "project_id": "...", "private_key_id": "...", "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n", "client_email": "..."}'
```

### Конфигурация в `.vitepress/config.ts`

В конфигурационном файле блога (`.vitepress/config.ts`) укажите эти переменные:

```javascript
import { defineConfig } from 'vitepress'
import { defineBlogConfig } from 'vitepress-theme-neptu-blog/configs'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig(
  defineBlogConfig({
    themeConfig: {
      googleAnalytics: {
        propertyId: process.env.GA_PROPERTY_ID,
        credentialsJson: process.env.GA_CREDENTIALS_JSON,
        // За сколько последних дней запрашивать статистику (по умолчанию 30)
        dataPeriodDays: 30, 
      },
      popularPosts: {
        enabled: true,
        sortBy: 'pageviews', // Возможные значения: 'pageviews', 'uniquePageviews', 'avgTimeOnPage'
      }
    },
  })
)
```

## 🔄 Процесс сборки и Логи

При сборке (`npm run build` или `npm run dev`) вы увидите в консоли процесс загрузки:

```bash
🔍 Fetching GA stats for property 123456789...
✅ Loaded GA stats for 25 paths.
📈 Merged GA stats for 15 posts.
```

### Обработка ошибок

Система безопасна к сбоям. Если произойдет ошибка сети, ключ будет недействителен или GA вернет пустой ответ, система выведет предупреждение в консоль, но **сборка не упадет**. Посты просто соберутся без статистики (сортировка по популярности откатится к сортировке по дате).

Примеры ошибок:
```bash
# Если нет данных за указанный период:
⚠️ GA returned no data for this period.

# Если неверные доступы или нет прав:
❌ Critical error fetching Google Analytics data:
Request failed with status code 403
```

## 🚀 CI/CD интеграция (GitHub Actions)

В настройках репозитория на GitHub перейдите в **Settings -> Secrets and variables -> Actions** и добавьте два секрета:
1. `GA_PROPERTY_ID`
2. `GA_CREDENTIALS_JSON` (вставьте всё содержимое JSON-ключа).

Пример workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci

      - name: Build Blog
        env:
          GA_PROPERTY_ID: ${{ secrets.GA_PROPERTY_ID }}
          GA_CREDENTIALS_JSON: ${{ secrets.GA_CREDENTIALS_JSON }}
        run: npm run build
```
