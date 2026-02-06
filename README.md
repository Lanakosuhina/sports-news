# Тренды Спорта - Спортивное медиа

Информационный медиа-портал спортивной тематики с административной панелью для управления контентом.

## Технологии

| Компонент | Технология |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Язык | TypeScript |
| Стили | Tailwind CSS v4 |
| ORM | Prisma |
| База данных | PostgreSQL |
| Авторизация | NextAuth.js |
| Редактор | TipTap (WYSIWYG) |

## Требования к серверу

- **Node.js** 18.x или выше
- **PostgreSQL** 14.x или выше
- **npm** 9.x или выше
- Минимум **512 MB RAM**
- Минимум **1 GB** свободного места на диске

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите ваши значения:

```env
# База данных PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth.js (авторизация)
NEXTAUTH_SECRET="ваш-секретный-ключ-минимум-32-символа"
NEXTAUTH_URL="https://ваш-домен.ru"

# Cron-задачи (опционально)
CRON_SECRET="секрет-для-cron-эндпоинта"
```

**Генерация NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Настройка базы данных

#### Вариант A: Чистая установка (новая база)

```bash
# Создать таблицы в базе данных
npm run db:push

# Заполнить начальными данными (админ, категории, страницы)
npm run db:seed
```

#### Вариант B: Восстановление из дампа

Если вам предоставлен файл `database_backup.sql`:

```bash
# Восстановить базу данных
psql -U postgres -d trendy_sporta < database_backup.sql
```

### 4. Сборка и запуск

```bash
# Сборка для production
npm run build

# Запуск production сервера
npm run start
```

Сайт будет доступен по адресу `http://localhost:3000`

## Вход в админ-панель

После выполнения `npm run db:seed`:

- **URL:** `/admin/login`
- **Email:** `admin@sportsnews.com`
- **Пароль:** `admin123`

**ВАЖНО:** Смените пароль администратора после первого входа!

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск в режиме разработки |
| `npm run build` | Сборка для production |
| `npm run start` | Запуск production сервера |
| `npm run lint` | Проверка кода ESLint |
| `npm run db:push` | Применить схему к базе данных |
| `npm run db:seed` | Заполнить начальными данными |
| `npm run db:studio` | Открыть Prisma Studio (GUI для БД) |

## Структура проекта

```
src/
├── app/
│   ├── (main)/              # Публичные страницы
│   │   ├── page.tsx         # Главная
│   │   ├── category/[slug]/ # Категории
│   │   ├── article/[slug]/  # Статьи
│   │   ├── bookmaker/[slug]/# Букмекеры
│   │   ├── matches/         # Матчи и результаты
│   │   └── page/[slug]/     # Статические страницы
│   ├── admin/               # Админ-панель
│   │   ├── login/           # Вход
│   │   └── (dashboard)/     # Управление контентом
│   └── api/                 # API эндпоинты
├── components/              # React компоненты
├── lib/                     # Утилиты и конфигурация
└── types/                   # TypeScript типы
```

## Функционал админ-панели

- **Статьи** — создание, редактирование, публикация новостей
- **Категории** — управление разделами сайта
- **Теги** — управление тегами для статей
- **Медиатека** — загрузка и управление изображениями
- **Страницы** — статические страницы (О нас, Контакты, Политики)
- **Импорт** — полуавтоматический импорт новостей из RSS
- **Реклама** — управление рекламными зонами

## Деплой на сервер

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения в настройках проекта
3. Vercel автоматически соберёт и развернёт проект

### VPS / Dedicated Server

1. Клонируйте репозиторий на сервер
2. Установите Node.js 18+ и PostgreSQL
3. Настройте `.env`
4. Выполните сборку: `npm run build`
5. Используйте PM2 для запуска:

```bash
# Установка PM2
npm install -g pm2

# Запуск приложения
pm2 start npm --name "trendy-sporta" -- start

# Автозапуск при перезагрузке
pm2 startup
pm2 save
```

### Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name ваш-домен.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL-сертификат (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d ваш-домен.ru
```

## Cron-задачи

Для автоматической проверки RSS-источников добавьте в crontab:

```bash
# Каждые 30 минут проверять новые статьи
*/30 * * * * curl -X GET "https://ваш-домен.ru/api/import/cron?secret=ВАШ_CRON_SECRET"
```

## Загрузка изображений

Изображения загружаются в папку `public/uploads/`. Убедитесь, что:
- Папка существует и доступна для записи
- Настроен достаточный лимит на размер загружаемых файлов в Nginx

```nginx
client_max_body_size 10M;
```

## Резервное копирование

### База данных

```bash
# Создание бэкапа
pg_dump -U postgres trendy_sporta > backup_$(date +%Y%m%d).sql

# Восстановление
psql -U postgres -d trendy_sporta < backup_20240101.sql
```

### Файлы

```bash
# Бэкап загруженных изображений
tar -czf uploads_backup.tar.gz public/uploads/
```

## Поддержка

При возникновении вопросов обращайтесь к разработчику.

---

© 2025-2026 Тренды Спорта. Все права защищены.
