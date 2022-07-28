import { MigrationInterface, QueryRunner } from "typeorm";

export class createProcessedStatementsTable1659036161178 implements MigrationInterface {
    name = 'createProcessedStatementsTable1659036161178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "processed_statements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(11,2) NOT NULL, "processedOn" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "statementId" uuid, CONSTRAINT "PK_a229902951f866cde7be5907dfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "processed_statements" ADD CONSTRAINT "FK_6c52c1b859988e2c6f763bc6562" FOREIGN KEY ("statementId") REFERENCES "statements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "processed_statements" DROP CONSTRAINT "FK_6c52c1b859988e2c6f763bc6562"`);
        await queryRunner.query(`DROP TABLE "processed_statements"`);
    }

}
