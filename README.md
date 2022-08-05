# promo_bot
Демо бот акционных предложений


## Запуск проекта
* Установить зависимости командой
	npm i
* Собрать проект командой 
	npm run build
* Запустить проект командой
	npm run start
---
## Зависимости
* Для использования переменных окружения из файла .env: dotenv: 
> Ссылка: [https://www.npmjs.com/package/dotenv]
* Для работы с базами данных: @prisma/client
> Ссылка: [https://www.npmjs.com/package/@prisma/client]
* Для работы с api telegram: 
> telegraf: [https://www.npmjs.com/package/telegraf]
> telegraf-session-local: [https://www.npmjs.com/package/telegraf-session-local]
* Для определения типов для Node.js в devDependencies добавлен пакет: @types/node
> Ссылка: [https://www.npmjs.com/package/@types/node]
---
## База данных
* Создание базовой конфигурации схемы командой: 
> npx prisma init
* Команда генерит файл .env и добавляет connection string для подключения к БД
> DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
* Структура строки подключения:
> DATABASE_URL="postgresql://{{имя пользователя}}:{{пароль}}@{{хост}}:{{порт}}/{{имя бд}}?schema={{ Схема, в которой будет лежать БД. По умолчанию public}}"
* Имя пользователя в connection string поменять на POSTGRES_PASSWORD, указанный в docker-compose.yml
* Параметр randompassword поменять на admin (значение пароля POSTGRES_PASSWORD указывается в docker-compose.yml)
* Пример итоговой строки подключения, указанной в .env: 
> DATABASE_URL="postgresql://postgres:admin@localhost:5432/mydb?schema=public"
* Добавляет в файл .gitignore 
> node_modules
> .env

---
## Развертывание БД локально
* Установить docker: [https://docs.docker.com/engine/install/]
* Развернуть локально БД с помощью конфигурации, описанной в docker-compose.yml (файл в корне проекта).
> docker-compose up -d
* Если порт 5432 занят, то в docker-compose.yml в блоке ports можно указать 5433:5432
* Проверить запустился ли контейнер:
> docker ps
---

## Первоначальные миграции
* Создание миграции:
> npx prisma migrate dev
* Заполнить БД данными:
> node prisma/seed.mjs

## Функционал
После введения в боте команды "/start" бот приветствует пользователя







