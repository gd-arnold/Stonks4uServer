import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Statement } from './Statement';

@Entity('statement_recurring_types')
export class StatementRecurringType {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	alias: string;

	@Column()
	name: string;

	@OneToMany(() => Statement, (statement) => statement.recurringType)
	statements: Statement[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
