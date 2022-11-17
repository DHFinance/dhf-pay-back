import {MigrationInterface, QueryRunner} from "typeorm";

export class DropWalletColumnFromStore1668503615607 implements MigrationInterface {
    name = 'DropWalletColumnFromStore1668503615607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "wallet"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "wallet" character varying NOT NULL`);
    }

}
