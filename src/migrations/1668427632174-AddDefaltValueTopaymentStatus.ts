import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaltValueTopaymentStatus1668427632174
  implements MigrationInterface
{
  name = 'AddDefaltValueTopaymentStatus1668427632174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'Not_paid'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "status" DROP DEFAULT`,
    );
  }
}
