import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnToUser1659446340377 implements MigrationInterface {
  name = 'addColumnToUser1659446340377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE "user" ADD "loginAttempts" integer DEFAULT 0`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "user" ADD "timeBlockLogin" date DEFAULT null`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "loginAttempts"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "timeBlockLogin"`);
  }
}
