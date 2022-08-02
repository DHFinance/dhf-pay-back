import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnToUser1659446340377 implements MigrationInterface {
    name = 'addColumnToUser1659446340377'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "loginAttempts" SET DEFAULT 0`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "timeBlockLogin" SET DEFAULT null`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "loginAttempts" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "loginAttempts" DROP DEFAULT`);
  }

}
