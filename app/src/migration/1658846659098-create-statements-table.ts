import { MigrationInterface, QueryRunner } from 'typeorm';

export class createStatementsTable1658846659098 implements MigrationInterface {
	name = 'createStatementsTable1658846659098';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."statements_type_enum" AS ENUM('income', 'expense')`
		);
		await queryRunner.query(
			`CREATE TABLE "statements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."statements_type_enum" NOT NULL, "amount" numeric(11,2) NOT NULL, "required_process" integer NOT NULL, "date" TIMESTAMP NOT NULL, "automaticPayment" boolean NOT NULL, "recurrenceRule" text NOT NULL, "categoryId" uuid, "recurringTypeId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT (now() at time zone 'utc'), "updatedAt" TIMESTAMP NOT NULL DEFAULT (now() at time zone 'utc'), CONSTRAINT "PK_7f53bcddeb706df7ea7eec10b8d" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "statements" ADD CONSTRAINT "FK_a06f03de01a64899de3616cf1d3" FOREIGN KEY ("categoryId") REFERENCES "statement_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "statements" ADD CONSTRAINT "FK_524ab79ede459a7b7dfc470824f" FOREIGN KEY ("recurringTypeId") REFERENCES "statement_recurring_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "statements" DROP CONSTRAINT "FK_524ab79ede459a7b7dfc470824f"`
		);
		await queryRunner.query(
			`ALTER TABLE "statements" DROP CONSTRAINT "FK_a06f03de01a64899de3616cf1d3"`
		);
		await queryRunner.query(`DROP TABLE "statements"`);
		await queryRunner.query(`DROP TYPE "public"."statements_type_enum"`);
	}
}
