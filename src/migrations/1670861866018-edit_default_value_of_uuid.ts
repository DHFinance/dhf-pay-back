import {MigrationInterface, QueryRunner} from "typeorm";

export class editDefaultValueOfUuid1670861866018 implements MigrationInterface {
    name = 'editDefaultValueOfUuid1670861866018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "url" SET DEFAULT uuid_generate_v1()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "url" SET DEFAULT 'd1665b41-9d4f-4eb2-9c36-f2ef41c2efb7'`);
    }

}
