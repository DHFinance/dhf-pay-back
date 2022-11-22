import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetSenderNullableToTrue1668849104444
  implements MigrationInterface
{
  name = 'SetSenderNullableToTrue1668849104444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "sender" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "sender" SET NOT NULL`,
    );
  }
}
