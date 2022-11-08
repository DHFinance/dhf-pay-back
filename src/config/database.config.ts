import * as path from 'path';

export default {
  host: process.env.DB_HOST,
  type: 'postgres',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  // dropSchema: true,
  synchronize: true, // process.env.DB_SYNCRONIZE === 'true',
  migrationsRun: true,
  migrations: [path.resolve(__dirname + '../migrations/*{.ts,.js}')],
  logging: process.env.DB_LOGGING === 'true',
};
