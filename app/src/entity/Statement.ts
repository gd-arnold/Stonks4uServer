import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ProcessedStatement } from './ProcessedStatement';
import { StatementCategory } from './StatementCategory';
import { StatementRecurringType } from './StatementRecurringType';
import { User } from './User';

export type StatementTypeType = 'income' | 'expense;';

@Entity('statements')
export class Statement {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@ManyToOne(() => User, (user) => user.statements)
	user: User;

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

	@OneToMany(() => ProcessedStatement, (processedStatement) => processedStatement.statement)
	processes: ProcessedStatement[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
