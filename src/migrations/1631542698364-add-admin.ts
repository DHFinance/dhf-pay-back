import { MigrationInterface, QueryRunner } from 'typeorm';

const env = require('dotenv').config().parsed
export class addAdmin1631542698364 implements MigrationInterface {
  name = 'addAdmin1631542698364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "user" ("name", "lastName", "password", "email", "role", "company", "token", "blocked") VALUES ('admin', 'admin', '95f8de6d395f4844d070053d6e7fe223b949e2e8', '${env.ADMIN_EMAIL}', 'admin', 'smartigy', '5ZlEqFyVD4XMnxJsSFZf2Yra1k3m44o1E59v', false)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user`);
  }
}
