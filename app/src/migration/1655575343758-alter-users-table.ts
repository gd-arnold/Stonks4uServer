import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterUsersTable1655575343758 implements MigrationInterface {
	name = 'alterUsersTable1655575343758';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT (now() at time zone 'utc')`
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT (now() at time zone 'utc')`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
	}
}
