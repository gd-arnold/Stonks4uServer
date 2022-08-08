import { ByWeekday, Frequency, RRule } from 'rrule';
import { AppDataSource } from '../config/data-source';
import { Statement } from '../entity/Statement';
import { StatementRecurrenceType } from '../entity/StatementRecurrenceType';

interface IRecurrence {
	freq: Frequency;
	dtstart: Date;
	interval?: number;
	byweekday?: ByWeekday[];
}

const StatementRecurrenceTypeRepository = AppDataSource.getRepository(StatementRecurrenceType);
const StatementRepository = AppDataSource.getRepository(Statement);

const dailyRecurrence = (dtstart: Date, byweekday?: ByWeekday[]) => {
	const rec: IRecurrence = {
		freq: RRule.DAILY,
		dtstart,
	};

	if (typeof byweekday !== 'undefined') {
		rec.byweekday = byweekday;
	}

	return rec;
};

const intervalRecurrence = (freq: Frequency, dtstart: Date, interval?: number) => {
	const rec: IRecurrence = { freq, dtstart };

	if (typeof interval !== 'undefined') {
		rec.interval = interval;
	}

	return rec;
};

export const StatementRecurrenceTypeService = {
	RTypeToRRuleMap: {
		once: (dtstart: Date) => new RRule({ ...dailyRecurrence(dtstart), until: dtstart }),
		daily: (dtstart: Date) => new RRule(dailyRecurrence(dtstart)),
		weekdays: (dtstart: Date) =>
			new RRule(dailyRecurrence(dtstart, [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR])),
		weekends: (dtstart: Date) => new RRule(dailyRecurrence(dtstart, [RRule.SA, RRule.SU])),
		weekly: (dtstart: Date) => new RRule(intervalRecurrence(RRule.WEEKLY, dtstart)),
		'two-weeks': (dtstart: Date) => new RRule(intervalRecurrence(RRule.WEEKLY, dtstart, 2)),
		monthly: (dtstart: Date) => new RRule(intervalRecurrence(RRule.MONTHLY, dtstart)),
		'two-months': (dtstart: Date) => new RRule(intervalRecurrence(RRule.MONTHLY, dtstart, 2)),
		'three-months': (dtstart: Date) => new RRule(intervalRecurrence(RRule.MONTHLY, dtstart, 3)),
		'six-months': (dtstart: Date) => new RRule(intervalRecurrence(RRule.MONTHLY, dtstart, 6)),
		yearly: (dtstart: Date) => new RRule(intervalRecurrence(RRule.YEARLY, dtstart)),
	},
	getRecurrenceTypeByAlias: async (alias: string) => {
		const recurrenceType = await StatementRecurrenceTypeRepository.createQueryBuilder(
			'recurrence_types'
		)
			.where('recurrence_types.alias = :alias', { alias })
			.getOne();

		return recurrenceType;
	},
	getRecurrenceTypeById: async (id: string) => {
		const recurrenceType = await StatementRecurrenceTypeRepository.createQueryBuilder(
			'recurrence_types'
		)
			.where('recurrence_types.id = :id', { id })
			.getOne();

		return recurrenceType;
	},
};
