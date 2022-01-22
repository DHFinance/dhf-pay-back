## Install

```bash
$ npm install
```

## Create  .env
Create .env file based on env.sample

```bash
#Database settings
DB_HOST = localhost
DB_PORT = 5432
DB_PASSWORD = Ytrewq654321
DB_USER = postgres
DB_DATABASE = casper
DB_SYNCRONIZE = true
DB_LOGGING = true
TYPEORM_MIGRATIONS_RUN = true
#Password hash secret
SECRET_HASH = passwordHashSecret
#Admin e-mail 
ADMIN_EMAIL = caspers.mailer@gmail.com
#Mail accaunt settings
MAILER_EMAIL = caspers.mailer@gmail.com
MAILER_PASSWORD = BCf!rufxQeYF@KVD87s76
#rabbitMQ connetction string
RABBIT_MQ=amqps://tncqeoap:xg6g86QzZQw0SRnM8Zk6EZwu0_9wb9um@bonobo.rmq.cloudamqp.com/tncqeoap
```

## Run
Run casper-back.
```bash
# development
$ npm run build
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Admin creation
Admin is creat automaticli with login admin and  password admin and e-mail from env.ADMIN_EMAIL
```bash
#create admin
$ npm run typeorm:migration:run
#remove admin
$ npm run migration:revert
```

## Run processor
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

All endoints hase prefix /api.  http://pay.dhfi.online:8088/api/user - for example.
All entytys (user, store, payment, transaction) support CRUD operations based on  https://github.com/nestjsx/crud .

## User

```bash
# User
{
    "name": "abc_абц1",
    "lastName": "abc_абц1",
    "company": "abc_абц1",
    # По почте происходит поиск пользователя и восстановление пароля. Должна быть уникальной
    "email": "kriruban1@gmail.com",
    # User role. admin or customer.
    "role": "customer",
    # User block status
    "blocked": false,
    # Pasword - stored encrypted
    "password": "801d3d52484551164e7dbddd98b0e55a0e7f3981",
    # Acces token
    "token": "DGphw7ZRd7db9TYS17s249WEMmDnaWjyMDzf",
    # Password recovery code
    "restorePasswordCode": null,
    # Email Verification, if null e-mail is veryfide else verification code that sent to user. 
    emailVerification": null,
    "id": 5
}

# Get user
GET /user - users list
GET /user/1 - user with id=1

POST auth/register - registre  a new user. The password will be stored encoded using SECRET_HASH. the email is found to match in the database and should be set. An email with a code will be sent to the email address provided. Until the email is confirmed, the user cannot be authorized.

{
    "name": "abc_абц1",
    "lastName": "abc_абц1",
    "email": "kriruban1@gmail.com",
    "company": "abc_абц1",
    "password": "12345678"
}

POST auth/verify - e-mail confirmation. You need to enter the code from the mail (if there were several attempts to register, enter the last one). If the code is correct, the user is registered in the system.

{ 
    "email": "kriruban1@gmail.com",
    "code": "12345678"
}

POST auth/login - authorization

{ 
    "email": "kriruban1@gmail.com",
    "password": "12345678"
}

GET auth/reAuth?token=${token} - token verification. Occurs on every page where authorization is required. Passes user data. If the token does not exist - returns an error and the user on the front is redirected to /login

POST auth/send-code - Forgotten password recovery. Occurs in 3 stages. The first is to specify the mail and send a message with the code to the specified mail (if the user exists). The mail specified on the front is used in all 3 steps

{ 
    "email": "kriruban1@gmail.com",
}

POST auth/check-code - checks the entered code with the one sent to the mail

{
    "code": "17686007",
    "email": "kriruban1@gmail.com"
}

POST auth/change-password - changes the user's password to a new one

{
    "password": "12345678",
    "email": "kriruban1@gmail.com"
}
```

## Store

```bash
# entity store
{
    "id": 28,
    #the URL to which the post-request with the payment data will be made after the status change
    "url": "http://localhost:3001/",
    "name": "store1",
    "description": "store description",
    #key that will be used in payment and transaction requests from customer users
    "apiKey": "y6t5r4e3w2",
    "blocked": false,
    #store wallet. All payments created on behalf of this store will be with this wallet
    "wallet": "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",
    #the user who created the store
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

# Get store
GET /store - stores list
GET /store/1 - store with  id=1

POST /store - create store
{ 
    "name": "storeUpdated",
    "description": "store description",
    "apiKey": "y6t5r4e3w2",
    "url": "http://localhost:3001/"
    "wallet": "01acdbbd933fd7aaedb7b1bd29c577027d86b5fafc422267a89fc386b7ebf420c9",
}

PATCH /store/1 - edits the data of the store fields entered in the request body with id=1
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
#update time
"datetime": "2021-12-16T11:55:25.111Z",
#Amaunt
"amount": "2500000000",
#payment status. Not_paid if no transactions were made for this payment. Paid - if the transaction amount is greater than or equal to the payment amount
"status": "Not_paid",
"comment": "",
#Recipient wallet. Taken from the merchant settings.
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

The payment is updated on the processor every 60 seconds. If its status changes, a message is sent to the mail of the store owner who paid for the transaction and a post request with payment data to the url specified in the store

apiKey - токен магазина, от лица которого будет создан платеж

# получить платеж
Фильтрация данных происходит по ApiKey и token.Для всех запросов ниже в headers должны быть указаны:

ApiKey магазина - Authorization: FesYGprJMRpUKhqvuz7r7YqrQyHX4ebwSmfz
Token пользователя - Authorization-x: DWkvW7p5k21fZ3kHZ1T15lYgNcS5zcLE28P0

GET /payment - получить список всех payment магазина с apiKey
GET /payment/1 - получить payment с id=1 из магазина с apiKey
GET /payment - получить список всех payment (если указан токен админа, apiKey не указывается)

POST /payment - получить список всех payment магазина с apiKey
{ 
    "amount": 2500000000,
    "comment": "test comment",
}
```

## Transaction

```bash
# сущность transaction
{
id: 111
#уплаченная сумма (берется из родительского payment)
amount: "2500000000"
#почта плательщика
email: "anton23490@gmail.com"
#платеж, на который была совершена транзакция
payment: 217
#кошелек получателя (берется из store, к которому пренадлежит родительский payment)
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

Фильтрация данных происходит по ApiKey и token.Для всех запросов ниже в headers должны быть указаны:

ApiKey магазина - Authorization: FesYGprJMRpUKhqvuz7r7YqrQyHX4ebwSmfz
Token пользователя - Authorization-x: DWkvW7p5k21fZ3kHZ1T15lYgNcS5zcLE28P0

GET /transaction - получить список всех transaction, которые связанны с payment магазина с apiKey. 
GET /transaction/${txHash} - получить transaction с указанным txHash
GET /transaction - получить список всех transaction (если указан токен админа, apiKey не указывается)

создать настоящую транзакцию, которая будет зарегистрированна в casper через postman запрос невозможно. Это делается с участием casper signer расширения на фронте

POST /transaction - Создать transaction
{
email: "anton23490@gmail.com"
payment:     {
        "id": 5,
        "datetime": "2021-12-23T14:37:27.310Z",
        "amount": "2500000000",
        "status": "Paid",
        "comment": "",
    }
sender: "016ecf8a64f9b341d7805d6bc5041bc42139544561f07a7df5a1d660d8f2619fee"
status: "fake_processing"
txHash: "d7DdAC148B97671859946603915175b46ea976e11D3263C28E2A35075D634789"
},

```
