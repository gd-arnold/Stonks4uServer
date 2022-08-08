import { AppDataSource } from '../../../config/data-source';
import Database from '../../../db';
import { StatementRecurrenceType } from '../../../entity/StatementRecurrenceType';
import { StatementRecurrenceTypeService } from '../../../service/StatementRecurrenceType';
import { TestDBContainer } from '../../utils/dbcontainer.utils';

describe('Statement recurrence type service suite', () => {
	jest.setTimeout(180000);

	const dbContainer = new TestDBContainer();

	beforeAll(async () => {
		await dbContainer.start();
		await Database.connect();
	});

	afterAll(async () => {
		await Database.disconnect();
		await dbContainer.stop();
	});

	const setup = () => {
		const repo = AppDataSource.getRepository(StatementRecurrenceType);

		return { repo };
	};

	test('Get recurrence type by alias', async () => {
		const { repo } = setup();

		expect(await StatementRecurrenceTypeService.getRecurrenceTypeByAlias('once')).toEqual(
			await repo.findOneBy({ alias: 'once' })
		);
		expect(await StatementRecurrenceTypeService.getRecurrenceTypeByAlias('invalid')).toEqual(null);
	});
});
