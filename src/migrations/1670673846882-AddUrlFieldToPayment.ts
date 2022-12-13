import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUrlFieldToPayment1670673846882 implements MigrationInterface {
    name = 'AddUrlFieldToPayment1670673846882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "url" character varying NOT NULL DEFAULT 'd1665b41-9d4f-4eb2-9c36-f2ef41c2efb7'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "url"`);
    }

}
