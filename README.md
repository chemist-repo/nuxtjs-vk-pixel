# nuxtjs-vk-pixel

Nuxt модуль для интеграции VK Pixel (Top.Mail.Ru счетчика) в Nuxt 3 приложения.

## 📦 Установка

```bash
npm install nuxtjs-vk-pixel
```

## ⚙️ Настройка

Добавьте модуль в `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: [
    'nuxtjs-vk-pixel',
  ],
  vkPixel: {
    id: 'your-pixel-id', // Обязательный параметр
    scriptSrc: 'https://top-fwz1.mail.ru/js/code.js', // Опционально
    noscriptSrc: 'https://top-fwz1.mail.ru/counter', // Опционально
    debug: false, // Опционально, по умолчанию true в dev режиме
  },
})
```

### Параметры конфигурации

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|----------|-----|--------------|--------------|----------|
| `id` | `string` | ✅ | `'xxx'` | ID вашего VK Pixel счетчика |
| `scriptSrc` | `string` | ❌ | `'https://top-fwz1.mail.ru/js/code.js'` | URL скрипта счетчика |
| `noscriptSrc` | `string` | ❌ | `'https://top-fwz1.mail.ru/counter'` | URL для noscript версии |
| `debug` | `boolean` | ❌ | `NODE_ENV !== 'production'` | Включить режим отладки |

## 🚀 Использование

### Composable

Используйте `useVkPixel()` для доступа к API счетчика:

```vue
<script setup lang="ts">
const vkPixel = useVkPixel()

// Отправка события просмотра страницы
vkPixel.pageView({
  url: window.location.href,
  referrer: document.referrer
})

// Отправка произвольного события
vkPixel.push({
  type: 'reachGoal',
  goal: 'purchase',
  params: {
    order_id: '12345',
    amount: 1000
  }
})
</script>
```

### Прямой доступ через NuxtApp

Вы также можете получить доступ к счетчику через `$vkPixel`:

```typescript
const { $vkPixel } = useNuxtApp()
$vkPixel.push({ type: 'pageView' })
```

## 📚 API

### `useVkPixel()`

Возвращает объект с методами для работы с VK Pixel.

#### `pageView(payload: IPageViewPayload)`

Отправляет событие просмотра страницы.

**Параметры:**
- `url: string` - URL страницы
- `referrer: string` - URL реферера

**Пример:**
```typescript
vkPixel.pageView({
  url: 'https://example.com/page',
  referrer: 'https://google.com'
})
```

#### `push(payload: IPushPayload)`

Отправляет произвольное событие в счетчик.

**Параметры:**
- `type: 'reachGoal' | 'pageView' | 'onready'` - Тип события
- `goal?: string` - Идентификатор цели (для `reachGoal`)
- `start?: number` - Время начала (timestamp)
- `url?: string` - URL страницы
- `category?: string` - Категория события
- `action?: string` - Действие
- `label?: string` - Метка события
- `params?: Record<string, unknown>` - Дополнительные параметры
- `callback?: (...args: any[]) => void` - Функция обратного вызова

**Примеры:**

```typescript
// Отслеживание достижения цели
vkPixel.push({
  type: 'reachGoal',
  goal: 'purchase',
  params: {
    order_id: '12345',
    amount: 1000,
    currency: 'RUB'
  }
})

// Отслеживание просмотра страницы
vkPixel.push({
  type: 'pageView',
  url: window.location.href,
  start: Date.now()
})

// Отслеживание готовности страницы
vkPixel.push({
  type: 'onready',
  callback: () => {
    console.log('Pixel загружен')
  }
})
```

## 🔧 Типы

Модуль экспортирует следующие TypeScript типы:

```typescript
interface IPageViewPayload {
  id: string
  url: string
  referrer: string
}

interface IPushPayload {
  id: string
  type: 'reachGoal' | 'pageView' | 'onready'
  goal?: string
  start?: number
  url?: string
  category?: string
  action?: string
  label?: string
  params?: Record<string, unknown>
  callback?: (...args: any[]) => void
}

interface IVkPixelTmr {
  pageView: (payload: IPageViewPayload) => void
  push: (payload: IPushPayload) => void
}
```

## 📝 Примеры использования

### Отслеживание покупки

```vue
<script setup lang="ts">
const vkPixel = useVkPixel()

const handlePurchase = async (orderId: string, amount: number) => {
  // Ваша логика покупки
  await processPurchase(orderId, amount)
  
  // Отправка события в VK Pixel
  vkPixel.push({
    type: 'reachGoal',
    goal: 'purchase',
    params: {
      order_id: orderId,
      amount: amount,
      currency: 'RUB'
    }
  })
}
</script>
```

### Отслеживание регистрации

```vue
<script setup lang="ts">
const vkPixel = useVkPixel()

const handleRegistration = async (email: string) => {
  await registerUser(email)
  
  vkPixel.push({
    type: 'reachGoal',
    goal: 'registration',
    params: {
      email: email
    }
  })
}
</script>
```

### Отслеживание добавления в корзину

```vue
<script setup lang="ts">
const vkPixel = useVkPixel()

const addToCart = (productId: string, price: number) => {
  // Ваша логика добавления в корзину
  cart.add(productId)
  
  vkPixel.push({
    type: 'reachGoal',
    goal: 'add_to_cart',
    params: {
      product_id: productId,
      price: price
    }
  })
}
</script>
```

## 🔍 Особенности

- ✅ Автоматическая загрузка скрипта счетчика
- ✅ Поддержка noscript версии для пользователей без JavaScript
- ✅ TypeScript поддержка из коробки
- ✅ Интеграция с `@nuxt/scripts` для оптимизированной загрузки
- ✅ Автоматическая инициализация при готовности Nuxt приложения
- ✅ Доступ через composable и через `$vkPixel`

## 📄 Лицензия

MIT

## 👤 Автор

Dmitrii Lartsev - [GitHub](https://github.com/chemist-repo)

## 🔗 Ссылки

- [Репозиторий](https://github.com/chemist-repo/nuxtjs-vk-pixel)
- [VK Pixel документация](https://top-fwz1.mail.ru/js/code.js)
