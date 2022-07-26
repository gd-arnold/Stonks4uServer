import { RRule } from 'rrule';
import { StatementRecurringTypeService } from '../../../service/StatementRecurringType';

describe('Statement recurring type suite', () => {
	test('RTypeToRRule returns correct RRule object', () => {
		const RTypeToRRuleMap = StatementRecurringTypeService.RTypeToRRuleMap;
		const dtstart = new Date(Date.UTC(2022, 27, 6, 23, 59));

		expect(RTypeToRRuleMap['once'](dtstart)).toEqual(
			new RRule({ freq: RRule.DAILY, dtstart, until: dtstart })
		);
		expect(RTypeToRRuleMap['daily'](dtstart)).toEqual(new RRule({ freq: RRule.DAILY, dtstart }));
		expect(RTypeToRRuleMap['weekdays'](dtstart)).toEqual(
			new RRule({
				freq: RRule.DAILY,
				dtstart,
				byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
			})
		);
		expect(RTypeToRRuleMap['weekends'](dtstart)).toEqual(
			new RRule({ freq: RRule.DAILY, dtstart, byweekday: [RRule.SA, RRule.SU] })
		);
		expect(RTypeToRRuleMap['weekly'](dtstart)).toEqual(new RRule({ freq: RRule.WEEKLY, dtstart }));
		expect(RTypeToRRuleMap['two-weeks'](dtstart)).toEqual(
			new RRule({ freq: RRule.WEEKLY, dtstart, interval: 2 })
		);
		expect(RTypeToRRuleMap['monthly'](dtstart)).toEqual(
			new RRule({ freq: RRule.MONTHLY, dtstart })
		);
		expect(RTypeToRRuleMap['two-months'](dtstart)).toEqual(
			new RRule({ freq: RRule.MONTHLY, dtstart, interval: 2 })
		);
		expect(RTypeToRRuleMap['three-months'](dtstart)).toEqual(
			new RRule({ freq: RRule.MONTHLY, dtstart, interval: 3 })
		);
		expect(RTypeToRRuleMap['six-months'](dtstart)).toEqual(
			new RRule({ freq: RRule.MONTHLY, dtstart, interval: 6 })
		);
		expect(RTypeToRRuleMap['yearly'](dtstart)).toEqual(new RRule({ freq: RRule.YEARLY, dtstart }));
	});
});
