import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrencyToPayment1668421091458 implements MigrationInterface {
  name = 'AddCurrencyToPayment1668421091458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "currency" character varying NOT NULL DEFAULT 'CSPR'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "currency"`);
  }
}
