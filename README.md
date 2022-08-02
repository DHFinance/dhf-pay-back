## DHF PAY
The crypto currency payment gateway on the CSPR blockchain. Made for pay and be paid easy and chill with blockchain and Casper Network.
System composed of 3 services:

|       Name         |            Link              |        Description                 |
|----------------|-------------------------------|-----------------------------|
|Backend  |<https://github.com/DHFinance/dhf-pay-back>            | Service backend            |
|Frontend          |<https://github.com/DHFinance/dhf-pay-front>            |Service frontend            |
|Processor          |<https://github.com/DHFinance/dhf-pay-processor>| Process a background tasks|

## Usage Guide 
See https://github.com/DHFinance/dhf-pay-front/blob/main/UserGuide.pdf

## Installation using docker
See https://github.com/DHFinance/dhf-pay-deploy

## Swagger
See https://pay.dhfi.online/api/swagger/

## Install

```bash
$ npm install
```

## Create .env
Create .env file like an example file env.sample

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
#Password encrypt hash
SECRET_HASH = passwordHashSecret
#Admin e-mail. Does`t need a verification 
ADMIN_EMAIL = caspers.mailer@gmail.com
#Credentals of mail account which will be used for mailing
MAILER_EMAIL = caspers.mailer@gmail.com
MAILER_PASSWORD = BCf!rufxQeYF@KVD87s76
#SMTP client settings
MAILER_HOST = smtppro.zoho.com
MAILER_SSL = 1,
MAILER_QAUTH = 1,
MAILER_PORT = 465,
#Captcha Secret Key
SECRET_KEY = captcha SECRET_KEY
#RabbitMQ connection string
RABBIT_MQ=amqps://tncqeoap:xg6g86QzZQw0SRnM8Zk6EZwu0_9wb9um@bonobo.rmq.cloudamqp.com/tncqeoap
```

## Run
Warning! Each build reset data in database.
```bash
$ npm run build
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Admin creation
Admin will be create using migration with password and login equals `admin` and with email wrote in env.ADMIN_EMAIL
```bash
#create admin
$ npm run typeorm:migration:run
#remove admin
$ npm run migration:revert
```

## Run processor
To create payments, mailing and notification clients dhf-pay-processor should run. See <https://github.com/DHFinance/dhf-pay-processor> for details.
```bash
# development
$ npm run build
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# API endpoints  
You can use API for atomisation your payments. 
Store apiKey - your merchant token  need to sign request to API. Api use token authentication and your key should be pass in HTTP headers  like below:

``Authorization: Bearer FesYGprJMRpUKhqvuz7r7YqrQyHX4ebwSmfz ``

## Payment

```bash
GET /payment (Authorization: Bearer *store ApiKey*) - payments list

GET /payment/1 (Authorization not required) - payment with  id = 1

POST /payment (Authorization: Bearer *store ApiKey*) - create  payment 
{ 
    "amount": 2500000000,
    "comment": "test comment",
}
```

## Transaction

```bash
GET /transaction (Authorization: Bearer *store ApiKey*) - transactions list 
```
## Swagger
You can see swagger here /api/swagger/.

## Run a specific test file
To run a separate file with tests, for example user.service.spec.ts in the user folder
```bash
jest src/user/user.service.spec.ts
```

## Run tests
To run the tests, enter at the root of the project
```bash
npm run test
```