import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { StatementCategory } from './StatementCategory';
import { StatementRecurringType } from './StatementRecurringType';

export type StatementTypeType = 'income' | 'expense;';

@Entity('statements')
export class Statement {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: ['income', 'expense'],
	})
	type: StatementTypeType;

	@ManyToOne(() => StatementCategory, (category) => category.statements)
	category: StatementCategory;

	@Column({
		type: 'decimal',
		precision: 11,
		scale: 2,
	})
	amount: number;

	@Column({ type: 'integer' })
	required_process: number;

	@Column({ type: 'timestamp without time zone' }) // UTC by default
	date: Date;

	@Column()
	automaticPayment: boolean;

	@ManyToOne(() => StatementRecurringType, (recurringType) => recurringType.statements)
	recurringType: StatementRecurringType;

	@Column({ type: 'text' })
	recurrenceRule: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
