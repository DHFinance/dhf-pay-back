import { MigrationInterface, QueryRunner } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('dotenv').config().parsed;
export class addAdmin1631542698364 implements MigrationInterface {
  name = 'addAdmin1631542698364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "loginAttempts" integer DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "user" ADD "timeBlockLogin" date DEFAULT null`);
    await queryRunner.query(`ALTER TABLE "payment" ADD "cancelled" boolean DEFAULT false`);
    await queryRunner.query(
      `INSERT INTO "user" ("name", "lastName", "password", "email", "role", "company", "token", "blocked") VALUES ('admin', 'admin', '$2b$07$PUx7RK/NjXwo7i9xpYT2vejPjU3A4hxCCvYYkDbZ/fcfgyFnCw9f.', '${env.ADMIN_EMAIL}', 'admin', 'smartigy', '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v', false)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "loginAttempts"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "timeBlockLogin"`);
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN  "cancelled"`);
    await queryRunner.query(`DELETE FROM "user"`);
  }
}
