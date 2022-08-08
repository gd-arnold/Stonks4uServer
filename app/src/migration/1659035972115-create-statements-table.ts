import { MigrationInterface, QueryRunner } from "typeorm";

export class createStatementsTable1659035972115 implements MigrationInterface {
    name = 'createStatementsTable1659035972115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."statements_type_enum" AS ENUM('income', 'expense')`);
        await queryRunner.query(`CREATE TABLE "statements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."statements_type_enum" NOT NULL, "amount" numeric(11,2) NOT NULL, "required_process" integer NOT NULL DEFAULT '0', "date" TIMESTAMP WITH TIME ZONE NOT NULL, "automaticPayment" boolean NOT NULL, "recurrenceRule" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, "categoryId" uuid, "recurrenceTypeId" uuid, CONSTRAINT "PK_7f53bcddeb706df7ea7eec10b8d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_9eb6244a1bc05e6e8937e1f7e91" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_a06f03de01a64899de3616cf1d3" FOREIGN KEY ("categoryId") REFERENCES "statement_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_03567e5c48a145a698222998739" FOREIGN KEY ("recurrenceTypeId") REFERENCES "statement_recurrence_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_03567e5c48a145a698222998739"`);
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_a06f03de01a64899de3616cf1d3"`);
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_9eb6244a1bc05e6e8937e1f7e91"`);
        await queryRunner.query(`DROP TABLE "statements"`);
        await queryRunner.query(`DROP TYPE "public"."statements_type_enum"`);
    }

}
