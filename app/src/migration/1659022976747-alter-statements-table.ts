import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterStatementsTable1659022976747 implements MigrationInterface {
	name = 'alterStatementsTable1659022976747';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "statements" ALTER COLUMN "required_process" SET DEFAULT '0'`
		);
		await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "date"`);
		await queryRunner.query(
			`ALTER TABLE "statements" ADD "date" TIMESTAMP WITH TIME ZONE NOT NULL`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "statements" DROP COLUMN "date"`);
		await queryRunner.query(`ALTER TABLE "statements" ADD "date" TIMESTAMP NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "statements" ALTER COLUMN "required_process" DROP DEFAULT`
		);
	}
}
