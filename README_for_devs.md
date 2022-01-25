## DHF PAY
The crypto currency payment gateway on the CSPR blockchain. Made for pay and be paid easy and chill with blockchain and Casper Network.
System composet from 3 service:

|                |                          |                         |
|----------------|-------------------------------|-----------------------------|
|Backend  |<https://github.com/DHFinance/dhf-pay-back>            | Service backend            |
|Frontend          |<https://github.com/DHFinance/dhf-pay-front>            |Service frontend            |
|Proseccor          |<https://github.com/DHFinance/dhf-pay-processor>| Process a background tasks|


## Installation using docker
See https://github.com/DHFinance/dhf-pay-deploy

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
#Почта на которую будет создан админ. Не требует верификации
ADMIN_EMAIL = caspers.mailer@gmail.com
#Данные для почтового аккаунта, с которого будет вестись рассылка
MAILER_EMAIL = caspers.mailer@gmail.com
MAILER_PASSWORD = BCf!rufxQeYF@KVD87s76
#Данные для почтового клиента, с которого рассылается почта
MAILER_HOST = smtppro.zoho.com
MAILER_SSL = 1,
MAILER_QAUTH = 1,
MAILER_PORT = 465,
#Ссылка для подключения на rabbitMQ. Должен быть одинаковым для casper-back и casper-processor. По ней идет соединение
RABBIT_MQ=amqps://tncqeoap:xg6g86QzZQw0SRnM8Zk6EZwu0_9wb9um@bonobo.rmq.cloudamqp.com/tncqeoap
```

## Запуск
Запуск casper-back. При каждом новом запуске база данных обнуляется
```bash
$ npm run build
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Создание админа
Админ создается через миграции. После сборки билда. Будет создан пользователь с ролью admin, паролем admin и почтой указанной в env.ADMIN_EMAIL
```bash
#создание админа
$ npm run typeorm:migration:run
#удаление админа
$ npm run migration:revert
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

# Справка по эндпоинтам

Store apiKey - токен вашего магазина. Используется для создания платежа от лица магазина и получения платежей и транзакций, связанных с вашим магазином. Передается в заголовке Authorization в подобном виде:

Authorization: Bearer FesYGprJMRpUKhqvuz7r7YqrQyHX4ebwSmfz

## Payment

```bash
GET /payment (Authorization: Bearer *store ApiKey*) - получить список всех payment магазина с apiKey

GET /payment/1 (Authorization не требуется) - получить данные payment с id = 1

POST /payment (Authorization: Bearer *store ApiKey*) - создать payment магазина с apiKey, указанным в Authorization
{ 
    "amount": 2500000000,
    "comment": "test comment",
}
```

## Transaction

```bash
GET /transaction (Authorization: Bearer *store ApiKey*) - получить список всех transaction, которые связанны с payment магазина с apiKey. 
```
