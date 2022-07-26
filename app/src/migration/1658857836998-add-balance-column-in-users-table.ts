import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBalanceColumnInUsersTable1658857836998 implements MigrationInterface {
	name = 'addBalanceColumnInUsersTable1658857836998';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" ADD "balance" numeric(11,2)`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance"`);
	}
}
