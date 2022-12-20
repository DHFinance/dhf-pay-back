// eslint-disable-next-line
const path = require('path');

module.exports = {
  host: process.env.DB_HOST,
  type: 'postgres',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  migrations: ['./dist/migrations/*.js'],
  logging: process.env.DB_LOGGING === 'true',
};
