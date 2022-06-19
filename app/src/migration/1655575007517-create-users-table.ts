import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1655575007517 implements MigrationInterface {
	name = 'createUsersTable1655575007517';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "username" character varying(20) NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "users"`);
	}
}
