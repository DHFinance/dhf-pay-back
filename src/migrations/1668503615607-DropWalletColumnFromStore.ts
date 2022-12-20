import {MigrationInterface, QueryRunner} from "typeorm";

export class DropWalletColumnFromStore1668503615607 implements MigrationInterface {
    name = 'DropWalletColumnFromStore1668503615607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "wallet"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "wallet" character varying DEFAULT '01867ec17ff3734558da148ece27de617757b431b23dc4c0fe5b290d27ade26919'`);
    }

}
