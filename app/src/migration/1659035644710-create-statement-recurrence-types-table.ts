import { MigrationInterface, QueryRunner } from "typeorm";

export class createStatementRecurrenceTypesTable1659035644710 implements MigrationInterface {
    name = 'createStatementRecurrenceTypesTable1659035644710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "statement_recurrence_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "alias" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_8526522eeb981699d3825042112" UNIQUE ("alias"), CONSTRAINT "PK_8148c4c325ae0e24a89526cf4db" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "statement_recurrence_types"`);
    }

}
