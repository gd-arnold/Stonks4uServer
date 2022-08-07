import { MigrationInterface, QueryRunner } from "typeorm";

export class addDeletedAtColumnInStatementCategoriesTable1659782346897 implements MigrationInterface {
    name = 'addDeletedAtColumnInStatementCategoriesTable1659782346897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statement_categories" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statement_categories" DROP COLUMN "deletedAt"`);
    }

}
