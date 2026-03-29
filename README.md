# Готовый старт: Vue + Docker

Проект уже готов для работы.

## Что нужно установить на Windows

1. `Git`
2. `Node.js (LTS)`
3. `Docker Desktop`

Если после установки `Node.js` команда `npm` в PowerShell не работает, используйте `npm.cmd`.

## Как запустить проект без Docker (обычный способ)

1. Откройте терминал в папке проекта:
   - `cd vue-site`
2. Поставьте зависимости:
   - `npm install`
3. Запустите сайт:
   - `npm run dev`
4. Откройте в браузере:
   - `http://localhost:5173`

## Как запустить проект через Docker

1. Убедитесь, что Docker Desktop запущен.
   - Если команда `docker` не находится, закройте и заново откройте терминал.
2. В папке проекта выполните:
   - `docker compose up --build`
3. Откройте в браузере:
   - `http://localhost:5173`
4. Остановка:
   - `Ctrl + C` в терминале

## Полезные команды

1. Проверка сборки:
   - `npm run build`
2. Если что-то зависло в Docker:
   - `docker compose down`

## Если Docker не запускается (ошибка 500 или `hasNoVirtualization`)

1. Закройте Docker Desktop.
2. Откройте PowerShell **от имени администратора**.
3. Выполните:
   - `wsl --install --no-distribution`
4. Перезагрузите компьютер.
5. Запустите Docker Desktop снова.
6. Проверьте:
   - `docker version`

## Где лежат важные файлы

1. Главная страница:
   - `src/App.vue`
2. Запуск Vue:
   - `src/main.js`
3. Docker-настройка:
   - `Dockerfile`
   - `docker-compose.yml`
