import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterStatementsTable1658918159171 implements MigrationInterface {
	name = 'alterStatementsTable1658918159171';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "statements" ADD "name" character varying NOT NULL`);
		await queryRunner.query(`ALTER TABLE "statements" ADD "userId" uuid`);
		await queryRunner.query(
			`ALTER TABLE "statements" ADD CONSTRAINT "FK_9eb6244a1bc05e6e8937e1f7e91" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "userId"`);
		await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "name"`);
	}
}
