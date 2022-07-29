import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { ProcessedStatement } from './ProcessedStatement';
import { StatementCategory } from './StatementCategory';
import { StatementRecurrenceType } from './StatementRecurrenceType';
import { User } from './User';

export type StatementTypeType = 'income' | 'expense';

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

	@Column({ type: 'integer', default: 0 })
	required_process: number;

	@Column({ type: 'timestamptz' })
	date: Date;

	@Column()
	automaticPayment: boolean;

	@ManyToOne(() => StatementRecurrenceType, (recurrenceType) => recurrenceType.statements)
	recurrenceType: StatementRecurrenceType;

	@Column({ type: 'text' })
	recurrenceRule: string;

	@OneToMany(() => ProcessedStatement, (processedStatement) => processedStatement.statement)
	processes: ProcessedStatement[];

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	deletedAt?: Date;
}
