# 🏗️ Build-Time Analytics

Система генерации популярных постов во время сборки (build time) для статических сайтов. Статистика запрашивается один раз при сборке и встраивается в статические файлы.

## 🎯 Преимущества Build-Time подхода

- ⚡ **Быстрая загрузка** - нет запросов к API во время работы сайта
- 🔒 **Безопасность** - credentials не нужны в продакшене
- 📦 **Статичность** - полностью статический сайт
- 🚀 **Производительность** - данные уже готовы
- 💰 **Экономия** - нет лимитов API запросов

## 🔧 Как это работает

1. **Во время сборки** (`npm run build`):
   - Система запрашивает статистику из выбранного источника
   - Сортирует посты по популярности
   - Генерирует JSON файл с результатами

2. **Во время работы сайта**:
   - Компонент загружает статический JSON файл
   - Отображает популярные посты без дополнительных запросов

## ⚙️ Настройка

### 1. Включите аналитику в конфигурации

```javascript
// .vitepress/config.js
export default defineConfig(
  defineBlogConfig({
    themeConfig: {
      analytics: {
        // Включить генерацию популярных постов во время сборки
        enabled: true,

        // Тип аналитики: 'google' или 'mock'
        type: 'mock',

        // Общие настройки
        sortBy: 'pageviews',
        popularPostsCount: 10,
        outputPath: 'popular-posts.json',
      },
    },
  })
)
```

### 2. Запустите сборку

```bash
npm run build
```

### 3. Результат

В директории `docs/` (или вашей `outDir`) появится файл `popular-posts.json`:

```json
{
  "generatedAt": "2024-01-15T10:30:00.000Z",
  "source": "mock",
  "totalPosts": 25,
  "popularPostsCount": 10,
  "posts": [
    {
      "url": "/en/post/popular-post-1",
      "title": "Popular Post 1",
      "date": "2024-01-10",
      "analytics": {
        "pageviews": 1234,
        "uniquePageviews": 987,
        "avgTimeOnPage": 180,
        "bounceRate": 0.23
      }
    }
  ]
}
```

## 📊 Поддерживаемые источники

### 1. 🎭 Моковые данные (для разработки)

```javascript
analytics: {
  enabled: true,
  type: 'mock',
  sortBy: 'pageviews',
  popularPostsCount: 10,
}
```

**Использование:**

- Разработка и тестирование
- Демонстрация функциональности
- Когда нет доступа к реальным данным

### 2. 📊 Google Analytics

```javascript
analytics: {
  enabled: true,
  type: 'google',
  google: {
    enabled: true,
    version: 'ga4', // или 'ua'
    propertyId: 'YOUR_PROPERTY_ID',
    credentialsPath: './credentials/ga-service-account.json',
    dataPeriodDays: 30,
  },
  sortBy: 'pageviews',
  popularPostsCount: 10,
}
```

**Требования:**

- Сервисный аккаунт Google Cloud
- JSON ключ с правами доступа
- Настройка в Google Analytics

## 🔄 Процесс сборки

### Логи сборки

При включенной аналитике вы увидите следующие сообщения:

```bash
📊 Генерируем популярные посты во время сборки...
🔍 Загружаем статистику из Google Analytics...
📊 Обработано 25 страниц из Google Analytics 4
✅ Популярные посты сохранены в docs/popular-posts.json
📈 Обработано 10 популярных постов из 25 общих
```

### Обработка ошибок

Если аналитика не настроена или произошла ошибка:

```bash
⚠️ Не удалось сгенерировать популярные посты: Google Analytics не настроен
```

Система продолжит сборку без популярных постов.

## 📁 Структура файлов

```
your-blog/
├── .vitepress/
│   └── config.js                 # Конфигурация аналитики
├── credentials/
│   └── ga-service-account.json   # JSON ключ от Google (если используется)
├── .cache/
│   └── post-views.json          # Данные просмотров (если используется)
├── docs/                        # Результат сборки
│   ├── popular-posts.json       # Сгенерированный файл с популярными постами
│   └── ...                      # Остальные файлы сайта
└── src/
    └── components/
        └── list/
            └── PopularPostsList.vue  # Компонент для отображения
```

## 🎨 Отображение на сайте

### Компонент PopularPostsList

Компонент автоматически:

1. **Загружает** статический JSON файл
2. **Отображает** популярные посты
3. **Показывает** статистику для каждого поста
4. **Использует fallback** при ошибках

### Визуальные индикаторы

- **📊 GA Stats** - данные из Google Analytics
- **📊 Mock Data** - моковые данные

### Статистика постов

Под каждым постом отображается:

- **👁️ 1,234 views** - количество просмотров
- **👤 987 unique views** - уникальные просмотры
- **⏱️ 3m 0s avg** - среднее время на странице
- **📈 23.4% bounce rate** - процент отказов

## 🔧 Переменные окружения

### Для продакшена

```bash
# .env
ANALYTICS_TYPE=google
GA_PROPERTY_ID=123456789
GA_CREDENTIALS_PATH=./credentials/ga-service-account.json
ANALYTICS_SORT_BY=pageviews
ANALYTICS_COUNT=10
```

```javascript
// .vitepress/config.js
analytics: {
  enabled: process.env.NODE_ENV === 'production',
  type: process.env.ANALYTICS_TYPE || 'mock',
  google: {
    enabled: process.env.ANALYTICS_TYPE === 'google',
    propertyId: process.env.GA_PROPERTY_ID,
    credentialsPath: process.env.GA_CREDENTIALS_PATH,
  },
  sortBy: process.env.ANALYTICS_SORT_BY || 'pageviews',
  popularPostsCount: parseInt(process.env.ANALYTICS_COUNT) || 10,
}
```

### Для разработки

```bash
# .env.development
ANALYTICS_TYPE=mock
ANALYTICS_ENABLED=false
```

## 🚀 CI/CD интеграция

### GitHub Actions

```yaml
# .github/workflows/build.yml
name: Build and Deploy

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

      - name: Install dependencies
        run: npm ci

      - name: Build with analytics
        env:
          ANALYTICS_TYPE: google
          GA_PROPERTY_ID: ${{ secrets.GA_PROPERTY_ID }}
          GA_CREDENTIALS_PATH: ./credentials/ga-service-account.json
        run: npm run build

      - name: Deploy
        run: # ваш скрипт деплоя
```

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"

[build.environment]
  ANALYTICS_TYPE = "google"
  GA_PROPERTY_ID = "123456789"

[[build.environment]]
  ANALYTICS_SORT_BY = "pageviews"
  ANALYTICS_COUNT = "10"
```

## 🔒 Безопасность

### Google Analytics

- ✅ **Credentials только при сборке** - не попадают в продакшен
- ✅ **Ограниченные права** - только чтение аналитики
- ✅ **Локальное хранение** - JSON ключи не в репозитории

## 📊 Мониторинг

### Логи сборки

Отслеживайте логи сборки для мониторинга:

```bash
# Успешная генерация
✅ Популярные посты сохранены в docs/popular-posts.json
📈 Обработано 10 популярных постов из 25 общих

# Ошибки
❌ Ошибка генерации популярных постов: Google Analytics не настроен
⚠️ Не удалось сгенерировать популярные посты: HTTP 401: Unauthorized
```

### Проверка файла

```bash
# Проверяем, что файл создан
ls -la docs/popular-posts.json

# Проверяем содержимое
cat docs/popular-posts.json | jq '.popularPostsCount'
```

## 🎯 Рекомендации

### Для продакшена

1. **Google Analytics** - если у вас есть GA
2. **Моковые данные** - для демонстрации

### Для разработки

1. **Моковые данные** - быстрый старт
2. **Отключенная аналитика** - для тестирования fallback

### Частота обновления

- **Ежедневно** - для актуальных данных
- **При каждом деплое** - для стабильности
- **По расписанию** - для автоматизации

## 🔧 Отладка

### Проблемы с Google Analytics

```bash
# Проверьте credentials
cat credentials/ga-service-account.json | jq '.client_email'

# Проверьте права доступа
# Email должен быть добавлен в GA с правами "Viewer"
```

### Проблемы с файлами

```bash
# Проверьте права доступа к credentials
ls -la credentials/ga-service-account.json

# Проверьте формат JSON
cat credentials/ga-service-account.json | jq '.client_email'
```
