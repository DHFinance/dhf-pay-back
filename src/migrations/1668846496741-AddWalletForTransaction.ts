import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWalletForTransaction1668846496741 implements MigrationInterface {
    name = 'AddWalletForTransaction1668846496741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "walletForTransaction" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ALTER COLUMN "txHash" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "walletForTransaction"`);
    }

}
