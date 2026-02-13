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
psql -U postgres -d sports_news < database_backup.sql
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
- **Букмекеры** — управление рейтингом букмекеров (с гибкими полями)
- **Страницы** — статические страницы (О нас, Контакты, Политики)
- **Реклама** — управление рекламными зонами с загрузкой баннеров
- **Пользователи** — управление администраторами
- **Настройки** — настройки сайта

## Деплой на Vercel (рекомендуется)

**ВАЖНО:** GitHub Pages НЕ подходит для этого проекта! Next.js с базой данных требует серверного хостинга.

### 1. Настройка базы данных

Создайте PostgreSQL базу данных на одном из сервисов:
- [Neon](https://neon.tech) — бесплатно, рекомендуется
- [Supabase](https://supabase.com) — бесплатно
- [Railway](https://railway.app) — бесплатно (ограниченно)

### 2. Деплой на Vercel

1. Зайдите на [vercel.com](https://vercel.com) и войдите через GitHub
2. Нажмите "Add New" → "Project"
3. Выберите репозиторий `sports-news`
4. В настройках добавьте переменные окружения:
   - `DATABASE_URL` — строка подключения к PostgreSQL
   - `NEXTAUTH_SECRET` — сгенерируйте: `openssl rand -base64 32`
   - `NEXTAUTH_URL` — URL вашего сайта на Vercel (например `https://sports-news.vercel.app`)
5. Нажмите "Deploy"

### 3. Инициализация базы данных

После первого деплоя выполните в терминале:

```bash
# Клонируйте репозиторий локально
git clone https://github.com/Lanakosuhina/sports-news.git
cd sports-news
npm install

# Настройте .env с вашим DATABASE_URL от Neon/Supabase
cp .env.example .env
# Отредактируйте .env

# Создайте таблицы и заполните данными
npm run db:push
npm run db:seed
```

### 4. Автоматический деплой

После настройки каждый `git push` в main будет автоматически деплоиться на Vercel.

---

## Деплой на VPS (альтернатива)

### 1. Подготовка сервера

```bash
# Установка Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установка PostgreSQL
sudo apt install postgresql postgresql-contrib

# Создание базы данных
sudo -u postgres psql
CREATE DATABASE sports_news;
CREATE USER sports_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sports_news TO sports_user;
\q
```

### 2. Развёртывание приложения

```bash
# Клонирование/копирование проекта
cd /var/www
# ... скопируйте проект сюда ...

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env
nano .env  # Отредактируйте значения

# Сборка
npm run build
```

### 3. Запуск через PM2

```bash
# Установка PM2
npm install -g pm2

# Запуск приложения
pm2 start npm --name "sports-news" -- start

# Автозапуск при перезагрузке
pm2 startup
pm2 save

# Полезные команды PM2
pm2 status           # Статус приложений
pm2 logs sports-news # Логи приложения
pm2 restart sports-news # Перезапуск
```

### 4. Настройка Nginx (reverse proxy)

```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;

    # Максимальный размер загружаемых файлов
    client_max_body_size 10M;

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

    # Кэширование статики
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /uploads {
        alias /var/www/sports-news/public/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/sports-news /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL-сертификат (Let's Encrypt)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

## Загрузка изображений

Изображения загружаются в папку `public/uploads/`. Убедитесь, что:
- Папка существует и доступна для записи
- Настроен достаточный лимит на размер загружаемых файлов в Nginx (`client_max_body_size 10M;`)

```bash
# Создание папки и установка прав
mkdir -p public/uploads
chmod 755 public/uploads
```

## Резервное копирование

### База данных

```bash
# Создание бэкапа
pg_dump -U postgres sports_news > backup_$(date +%Y%m%d).sql

# Восстановление
psql -U postgres -d sports_news < backup_20260206.sql
```

### Файлы

```bash
# Бэкап загруженных изображений
tar -czf uploads_backup.tar.gz public/uploads/
```

## Обновление сайта

```bash
# Остановка приложения
pm2 stop sports-news

# Обновление кода (git pull или копирование)
# ...

# Установка новых зависимостей
npm install

# Применение изменений БД (если есть)
npm run db:push

# Пересборка
npm run build

# Запуск
pm2 start sports-news
```

## Поддержка

При возникновении вопросов обращайтесь к разработчику.

---

© 2025-2026 Тренды Спорта. Все права защищены.
