import { MigrationInterface, QueryRunner } from "typeorm";

export class addDeletedAtColumnInStatementsTable1659107701829 implements MigrationInterface {
    name = 'addDeletedAtColumnInStatementsTable1659107701829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "deletedAt"`);
    }

}
