import { MigrationInterface, QueryRunner } from 'typeorm';

 export class addFieldCancelledToPayment1652272383243
   implements MigrationInterface {
   name = 'addFieldCancelledToPayment1652272383243';

   public async up(queryRunner: QueryRunner): Promise<void> {
     // await queryRunner.query(
     //   `ALTER TABLE "payment" ADD "cancelled" boolean DEFAULT false`,
     // );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
     await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN  "cancelled"`);
   }
 }
