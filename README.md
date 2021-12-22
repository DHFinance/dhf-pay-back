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
#Ссылка для подключения на rabbitMQ. Должен быть одинаковым для casper-back и casper-processor. По ней идет соединение
RABBIT_MQ=amqps://tncqeoap:xg6g86QzZQw0SRnM8Zk6EZwu0_9wb9um@bonobo.rmq.cloudamqp.com/tncqeoap
```

## Запуск
Запуск casper-back. При каждом новом запуске база данных обнуляется
```bash
# development
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

Для всех эндпоинтов используется префикс /api.  http://demo.casperpay.live:8088/api/user - пример эндпоинта.
Для всех 4х сущностей (user, store, payment, transaction) существуют круды, созданные при помощи https://github.com/nestjsx/crud . Те что используются будут описаны ниже.


## User

```bash
# сущность user
{
    "name": "abc_абц1",
    "lastName": "abc_абц1",
    "company": "abc_абц1",
    # По почте происходит поиск пользователя и восстановление пароля. Должна быть уникальной
    "email": "kriruban1@gmail.com",
    # Роль пользователя. admin или customer. admin - может блокировать пользователей, магазины, может видеть все записи из базы данных на фронте, не может иметь собственных магазинов (соответственно создавать payment). customer - может видеть только свои записи, может создавать payments
    "role": "customer",
    # Блокировка пользователя. Запрещает пользователю входить в систему
    "blocked": false,
    # Пароль. Хранится в зашифрованном виде с помощью SECRET_HASH
    "password": "801d3d52484551164e7dbddd98b0e55a0e7f3981",
    # Токен. Выдается после регистрации. Хранится в localstore на фронте. По нему проверяется наличие пользователя в базе
    "token": "DGphw7ZRd7db9TYS17s249WEMmDnaWjyMDzf",
    # При восстановлении пароля сюда записывается уникальный код для восстановления, который отправляется на почту. После смены пароля - обнуляется
    "restorePasswordCode": null,
    # Подтверждение почты. Если пройдено - значение null. Если пользователь не подтвердил еще свою почту - значение - десятизначный код, высланный на указанную почту. 
    emailVerification": null,
    "id": 5
}

# получить пользователя
GET /user - получить список всех пользователей
GET /user/1 - получить пользователя с id=1

POST auth/register - регистрация нового пользователя. Пароль будет храниться в закодированном виде с помощью SECRET_HASH. email проверяется на совпадение в базе и должен быть уникальным. На указанную почту отправляется письмо с кодом. До момента подтверждения почты пользователь не может быть авторизован.

{
    "name": "abc_абц1",
    "lastName": "abc_абц1",
    "email": "kriruban1@gmail.com",
    "company": "abc_абц1",
    "password": "12345678"
}

POST auth/verify - подтверждение почты. Нужно ввести код с почты (если было несколько попыток регистрации ввести последний). Если код верен - пользователь зарегистрирован в системе.

{ 
    "email": "kriruban1@gmail.com",
    "password": "1234567890"
}

POST auth/login - авторизация. Выдает ошибку если логин или пароль не совпадают

{ 
    "email": "kriruban1@gmail.com",
    "password": "12345678"
}

GET auth/reAuth?token=${token} - проверка токена. Происходит на каждой странице где есть нужна авторизация. Передает данные пользователя. Если токена не существует - возвращает ошибку и пользователя на фронте перенаправляет на /login

POST auth/send-code - восстановление забытого пароля. Происходит в 3 этапа. Первый - указание почты и отправление сообщения с кодом на указанную почту (если пользователь существует). Указанная на фронте почта используется во всех 3х шагах

{ 
    "email": "kriruban1@gmail.com",
}

POST auth/check-code - сверяет введенный код с тем, что был выслан на почту

{
    "code": "17686007",
    "email": "kriruban1@gmail.com"
}

POST auth/change-password - изменяет пароль пользователя на новый 

{
    "password": "12345678",
    "email": "kriruban1@gmail.com"
}
```

## Store

```bash
# сущность store
{
    "id": 28,
    #урл на который будет совершен post-запрос с данными payment после смены статуса
    "url": "http://localhost:3001/",
    "name": "store1",
    "description": "store description",
    #ключ, который будет использоваться в запросах payment и transaction у пользователей customer
    "apiKey": "y6t5r4e3w2",
    "blocked": false,
    #кошелек магазина. Все payments созданные от лица этого магазина будут с этим кошельком
    "wallet": "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",
    #пользователь, создавший магазин
    "user": {
        "id": 64,
        "name": "1",
        "lastName": "1",
        "password": "68be41e7f2b5683b5556b4562781cf7633477af3",
        "restorePasswordCode": null,
        "email": "anton23490@gmail.comc",
        "role": "customer",
        "company": "1",
        "token": "vNO5LUoMq1tFdRz4891j8RJOqGO72pu5orO6",
        "blocked": false
    }
}

# получить пользователя
GET /store - получить список всех магазинов
GET /store/1 - получить магазин с id=1

POST /store - создает магазин
{ 
    "name": "storeUpdated",
    "description": "store description",
    "apiKey": "y6t5r4e3w2",
    "url": "http://localhost:3001/"
    "wallet": "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",
}

PATCH /store/1 - редактирует данные введенных в теле запроса полей магазина с id=1
{ 
    "name": "storeUpdated",
    "description": "store description",
    "apiKey": "y6t5r4e3w2",
    "url": "http://localhost:3001/"
    "wallet": "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",
}
```

## Payment

```bash
# сущность payment
{
"id": 215,
#время последнего обновления
"datetime": "2021-12-16T11:55:25.111Z",
#размер перевода
"amount": "2500000000",
#статус платежа. Not_paid если транзакции по этому платежу не совершались. Particularly_paid - если оплачен, но не полностью (сумма транзакции всегда равна сумме платежа, но могут быть исключения. Например перевод не из нашего приложения). Paid - если сумма транзакций превышает или равна сумме платежа
"status": "Not_paid",
"comment": "",
#кошелек получателя. Можно получить в casper signer
"wallet": "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",
"store": {
            "id": 20,
            "url": "http://localhost:3001/",
            "name": "storeUpdated",
            "description": "store description",
            "apiKey": "y6t5r4e3w2",
            "blocked": false
        }
},

Платеж обновляется на процессоре каждые 60 секунд. Если его статус меняется - отправляется сообщение на почту владельца магазина, на почту оплатившего транзакцию и post запрос с данными payment на url указанный в магазине

apiKey - магазин, от лица которого будет создан платеж

# получить платеж
GET ${apiKey}/payment - получить список всех payment магазина с apiKey
GET ${apiKey}/payment/1 - получить payment с id=1 из магазина с apiKey
GET /payment - получить список всех payment

POST ${apiKey}/payment - получить список всех payment магазина с apiKey
{ 
    "datetime": "2014-12-24 23:12:00",
    "amount": 2500000000,
    "comment": "test comment",
    "status": "Not_paid",
    "wallet": "016ecf8a64f9b341d7805d6bc5041bc42139544561f07a7df5a1d660d8f2619fee"
}
```

## Transaction

```bash
# сущность transaction
{
id: 111
#уплаченная сумма
amount: "2500000000"
#почта плательщика
email: "anton23490@gmail.com"
#платеж, на который была совершена транзакция
payment: 217
#кошелек получателя
receiver: "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9"
#кошелек отправителя
sender: "016ecf8a64f9b341d7805d6bc5041bc42139544561f07a7df5a1d660d8f2619fee"
#статус. В фейковом режиме (без участия signer, так как он не доступен на домене не localhost) fake_processing и fake_success. Меняется автоматически каждую минуту. В signer режиме - processing, success и ${error} (ошибка, выданная signer), меняет статус, как только транзакция прекратит обрабатываться. Информация о транзакии берется отсюда https://event-store-api-clarity-testnet.make.services/deploys/*сюда вставить txHash* .
status: "fake_processing"
#хэш транзакции. Выдается signer. По нему можно посмотреть состояние транзакции, вставив в ссылки ниже
txHash: "d7DdAC148B97671859946603915175b46ea976e11D3263C28E2A35075D634789"
#дата последнего обновления
updated: "2021-12-21T07:33:37.116Z"
},

Транзакция обновляется на процессоре каждые 60 секунд. Если ее статус меняется - отправляется сообщение на почту владельца магазина, на почту оплатившего транзакцию 

Информацию по транзакции можно получить по этим ссылкам. Подставив txHash своей транзакции.

объект с полной информацией о транзакции. Отсюда берется статус и ошибка

https://event-store-api-clarity-testnet.make.services/deploys/1c4E67848D6058FE85f3541C08d9B85f058959fb8C959Bf8A798235bc8614Bc5

информация о транзакции на сайте каспера

https://testnet.cspr.live/deploy/4b9CA4Ff6F896edCF5eDAFc2e86B1739A8259312e34d608F5D2C44464fA0c957

apiKey - магазин, от лица которого будет создан платеж

# получить платеж
GET ${apiKey}/transaction - получить список всех transaction, которые связанны с payment магазина с apiKey
GET ${apiKey}/transaction/${txHash} - получить transaction с указанным txHash
GET /transaction - получить список всех transaction

создать настоящую транзакцию, которая будет зарегистрированна в casper через postman запрос невозможно. Это делается с участием casper signer расширения на фронте

POST ${apiKey}/transaction - Создать transaction
{
amount: "2500000000"
email: "anton23490@gmail.com"
payment: 217
receiver: "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9"
sender: "016ecf8a64f9b341d7805d6bc5041bc42139544561f07a7df5a1d660d8f2619fee"
status: "fake_processing"
txHash: "d7DdAC148B97671859946603915175b46ea976e11D3263C28E2A35075D634789"
updated: "2021-12-21T07:33:37.116Z"
},

```