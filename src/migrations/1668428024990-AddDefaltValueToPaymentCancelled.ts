import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDefaltValueToPaymentCancelled1668428024990 implements MigrationInterface {
    name = 'AddDefaltValueToPaymentCancelled1668428024990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "cancelled" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "cancelled" DROP DEFAULT`);
    }

}
