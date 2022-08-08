import { MigrationInterface, QueryRunner } from "typeorm";

export class renameRequiredProcessesColumnInStatementsTable1659966655224 implements MigrationInterface {
    name = 'renameRequiredProcessesColumnInStatementsTable1659966655224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" RENAME COLUMN "required_process" TO "required_processes"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" RENAME COLUMN "required_processes" TO "required_process"`);
    }

}
