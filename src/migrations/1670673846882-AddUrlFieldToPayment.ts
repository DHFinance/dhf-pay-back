import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUrlFieldToPayment1670673846882 implements MigrationInterface {
    name = 'AddUrlFieldToPayment1670673846882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "url" character varying NOT NULL DEFAULT uuid_in(md5(random()::text || random()::text)::cstring)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "url"`);
    }

}
