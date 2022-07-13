import { MigrationInterface, QueryRunner } from "typeorm";

export class createStatementCategoriesTable1657717635950 implements MigrationInterface {
    name = 'createStatementCategoriesTable1657717635950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."statement_categories_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`CREATE TABLE "statement_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."statement_categories_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_5565da785b4d8840f111b57e11b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "statement_categories" ADD CONSTRAINT "FK_980f7fd13f8c6df713a9eb7ecc4" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statement_categories" DROP CONSTRAINT "FK_980f7fd13f8c6df713a9eb7ecc4"`);
        await queryRunner.query(`DROP TABLE "statement_categories"`);
        await queryRunner.query(`DROP TYPE "public"."statement_categories_type_enum"`);
    }

}
