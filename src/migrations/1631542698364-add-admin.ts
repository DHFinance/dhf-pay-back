import { MigrationInterface, QueryRunner } from 'typeorm';

const env = require('dotenv').config().parsed
export class addAdmin1631542698364 implements MigrationInterface {
  name = 'addAdmin1631542698364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "user" ("name", "lastName", "password", "email", "role", "company", "token", "blocked", "loginAttempts", "timeBlockLogin") VALUES ('admin', 'admin', '$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f.', '${env.ADMIN_EMAIL}', 'admin', 'smartigy', '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v', false, 0, null)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user"`);
  }
}
