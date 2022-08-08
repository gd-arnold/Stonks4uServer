import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Statement } from './Statement';

@Entity('statement_recurrence_types')
export class StatementRecurrenceType {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	alias: string;

	@Column()
	name: string;

	@OneToMany(() => Statement, (statement) => statement.recurrenceType)
	statements: Statement[];

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
