import { MigrationInterface, QueryRunner } from 'typeorm';

export class createStatementRecurringTypesTable1658841294526 implements MigrationInterface {
	name = 'createStatementRecurringTypesTable1658841294526';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "statement_recurring_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alias" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_5e8ba283937ece4c609bd30039c" UNIQUE ("alias"), CONSTRAINT "PK_c2b644a8620e59bfa309b548f5c" PRIMARY KEY ("id"))`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "statement_recurring_types"`);
	}
}
