# 📊 Google Analytics для популярных постов

Интеграция Google Analytics позволяет отображать самые популярные посты на основе реальной статистики посещений.

## ✨ Возможности

- 🎯 **Умная сортировка** постов по статистике GA
- 📈 **Множественные критерии**: просмотры, уникальные просмотры, время на странице, процент отказов
- ⚡ **Кэширование** для повышения производительности
- 🔄 **Автоматический fallback** на сортировку по дате
- 🎨 **Визуальные индикаторы** использования GA статистики
- 📱 **Адаптивный дизайн** с красивыми иконками
- 🔧 **Официальная библиотека** `googleapis` от Google
- 🆕 **Поддержка GA4** и Universal Analytics
- 🛠️ **Моковые данные** для разработки

## 🚀 Быстрый старт

### 1. Установите зависимости

```bash
npm install googleapis
```

### 2. Включите GA в конфигурации

```javascript
// .vitepress/config.js
export default defineConfig(
  defineBlogConfig({
    themeConfig: {
      googleAnalytics: {
        enabled: true, // Включить GA
        version: 'ga4', // 'ga4' или 'ua'
        propertyId: 'YOUR_GA4_PROPERTY_ID',
        credentialsPath: './credentials/ga-service-account.json',
        sortBy: 'pageviews', // Критерий сортировки
        cacheHours: 24,
        cacheFilePath: './.cache/ga-stats.json',
        dataPeriodDays: 30,
        useMockData: false, // true для разработки
      },
    },
  })
)
```

### 3. Настройте Google Analytics API

1. Создайте сервисный аккаунт в Google Cloud Console
2. Скачайте JSON ключ
3. Добавьте email сервисного аккаунта в GA с правами "Viewer"

### 4. Готово!

Компонент `PopularPostsList` автоматически начнет использовать статистику GA.

## 📊 Критерии сортировки

| Критерий          | Описание             | Иконка | Пример            |
| ----------------- | -------------------- | ------ | ----------------- |
| `pageviews`       | Общие просмотры      | 👁️     | 1,234 views       |
| `uniquePageviews` | Уникальные просмотры | 👤     | 987 unique views  |
| `avgTimeOnPage`   | Время на странице    | ⏱️     | 5m 23s avg        |
| `bounceRate`      | Процент отказов      | 📈     | 23.4% bounce rate |

## 🎨 Визуальные элементы

### Индикатор загрузки

```html
<!-- Показывается во время загрузки статистики -->
<div class="flex items-center text-sm text-gray-500">
  <svg class="animate-spin">...</svg>
  Loading analytics...
</div>
```

### Индикатор GA

```html
<!-- Показывается когда GA активен -->
<div class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
  📊 GA Stats
</div>
```

### Статистика поста

```html
<!-- Показывается под каждым постом -->
<div class="ml-4 mt-1 text-xs text-gray-500">👁️ 1,234 views</div>
```

## 🔧 Настройка

### Конфигурация GA

```javascript
googleAnalytics: {
  // Основные настройки
  enabled: true,                    // Включить/выключить GA
  propertyId: '123456789',         // ID свойства GA4
  credentialsPath: './ga-key.json', // Путь к JSON ключу

  // Сортировка
  sortBy: 'pageviews',             // Критерий сортировки

  // Кэширование
  cacheHours: 24,                  // Время кэша в часах
  cacheFilePath: './.cache/ga.json' // Путь к файлу кэша
}
```

### Переменные окружения

```bash
# .env
GA_PROPERTY_ID=123456789
GA_CREDENTIALS_PATH=./credentials/ga-service-account.json
GA_CACHE_HOURS=24
```

```javascript
// Использование в конфиге
googleAnalytics: {
  enabled: process.env.NODE_ENV === 'production',
  propertyId: process.env.GA_PROPERTY_ID,
  credentialsPath: process.env.GA_CREDENTIALS_PATH,
  cacheHours: parseInt(process.env.GA_CACHE_HOURS) || 24
}
```

## 📚 Используемые библиотеки

### `googleapis` - Официальная библиотека Google

```bash
npm install googleapis
```

**Преимущества:**

- ✅ Официальная поддержка от Google
- ✅ Автоматическая аутентификация
- ✅ Поддержка GA4 и Universal Analytics
- ✅ TypeScript типы
- ✅ Активное развитие

**Версия:** `^144.0.0`

## 🛠️ Разработка

### Моковые данные

Для разработки система автоматически генерирует моковые данные:

```javascript
// Автоматически генерируется если GA не настроен
const mockStats = {
  '/en/post/example-post': {
    pageviews: 1234,
    uniquePageviews: 987,
    avgTimeOnPage: 180,
    bounceRate: 0.23,
  },
}
```

### Отладка

```javascript
// Включите логирование
console.log('GA Config:', theme.value.googleAnalytics)
console.log('GA Stats:', gaStats.value)
console.log('Popular Posts:', popularPosts.value)
```

## 🚨 Обработка ошибок

Система автоматически обрабатывает ошибки:

1. **GA отключен** → Сортировка по дате
2. **Ошибка API** → Показ сообщения + fallback
3. **Нет данных** → Сортировка по дате
4. **Устаревший кэш** → Автоматическое обновление

## 📁 Структура файлов

```
your-blog/
├── .vitepress/
│   └── config.js                 # Конфигурация GA
├── credentials/
│   └── ga-service-account.json   # JSON ключ от Google
├── .cache/
│   └── ga-stats.json            # Кэш статистики
├── src/
│   └── components/
│       └── list/
│           └── PopularPostsList.vue  # Обновленный компонент
└── docs/
    └── GOOGLE_ANALYTICS_POPULAR_POSTS.md  # Подробная документация
```

## 🔒 Безопасность

- ✅ **Не коммитьте** JSON ключи в Git
- ✅ **Используйте** переменные окружения
- ✅ **Ограничьте права** сервисного аккаунта
- ✅ **Регулярно обновляйте** ключи доступа

## 📚 Дополнительные ресурсы

- [Подробная документация](./docs/GOOGLE_ANALYTICS_POPULAR_POSTS.md)
- [Google Analytics Reporting API](https://developers.google.com/analytics/devguides/reporting/core/v4)
- [Google Cloud Console](https://console.cloud.google.com/)
- [VitePress документация](https://vitepress.dev/)

## 🤝 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [документацию](./docs/GOOGLE_ANALYTICS_POPULAR_POSTS.md)
2. Убедитесь в правильности настройки GA API
3. Проверьте права доступа сервисного аккаунта
4. Создайте issue в репозитории

---

**Примечание**: Текущая реализация использует моковые данные для демонстрации. Для подключения к реальному Google Analytics API следуйте инструкциям в [подробной документации](./docs/GOOGLE_ANALYTICS_POPULAR_POSTS.md).
