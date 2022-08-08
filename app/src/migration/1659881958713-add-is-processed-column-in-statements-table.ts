import { MigrationInterface, QueryRunner } from "typeorm";

export class addIsProcessedColumnInStatementsTable1659881958713 implements MigrationInterface {
    name = 'addIsProcessedColumnInStatementsTable1659881958713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" ADD "isProcessed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "isProcessed"`);
    }

}
