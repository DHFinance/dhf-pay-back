import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWalletEntity1668176047893 implements MigrationInterface {
  name = 'AddWalletEntity1668176047893';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallet_orm_entity" ("id" SERIAL NOT NULL, "currency" character varying NOT NULL, "value" character varying NOT NULL, "storeId" integer, CONSTRAINT "PK_88913b4f6dd46dadba406c03e0f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_orm_entity" ADD CONSTRAINT "FK_2f0115e4a72f8fb494800bceea7" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `INSERT INTO "wallet_orm_entity" ("value", "storeId", "currency") SELECT "wallet", "id", 'CSPR' FROM "stores"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet_orm_entity" DROP CONSTRAINT "FK_2f0115e4a72f8fb494800bceea7"`,
    );
    await queryRunner.query(`DROP TABLE "wallet_orm_entity"`);
  }
}
