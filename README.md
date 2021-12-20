## Установка

```bash
$ npm install
```

## Создание .env
Создайте .env файл (для образца дан env.sample)

```bash
#Настройки для базы данных
DB_HOST = localhost
DB_PORT = 5432
DB_PASSWORD = Ytrewq654321
DB_USER = postgres
DB_DATABASE = casper
DB_SYNCRONIZE = true
DB_LOGGING = true
TYPEORM_MIGRATIONS_RUN = true
#Хэш для кодирования пароля
SECRET_HASH = passwordHashSecret
#Данные для почтового аккаунта, с которого будет вестись рассылка
MAILER_EMAIL = caspers.mailer@gmail.com
MAILER_PASSWORD = BCf!rufxQeYF@KVD87s76
#Ссылка для подключения на rabbitMQ. Должен быть одинаковым для casper-back и casper-processor. По ней идет соединение
RABBIT_MQ=amqps://tncqeoap:xg6g86QzZQw0SRnM8Zk6EZwu0_9wb9um@bonobo.rmq.cloudamqp.com/tncqeoap
```

## Запуск
Запуск casper-back
```bash
# development
$ npm run build
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Создание администратора
Администратора можно создать в базе данных (например через DBeaver). Для этого нужно создать запись в таблице user со следующими данными. Пароль пользователя зашифрован. Для авторизации данными будут email и пароль 1234 (можно сменить в процессе на странице /restore если была указана ваша почта)

```bash
"name": "admin",
"lastName": "admin",
"password": "68be41e7f2b5683b5556b4562781cf7633477af3",
"email": "admin@gmail.com", *ввести свою существующую почту*
"role": "admin",
"company": "admin",
"token": "VNvDeoXRR6QDNSNj0NwXICpXxmv4xz3fDIfH",
"blocked": false
```

## Запуск процессора
За создание payments и рассылку оповещений (электронных писем и запросов на сайты) отвечает casper-processor. Он должен работать одновременно с casper-back
```bash
# development
$ npm run build
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

