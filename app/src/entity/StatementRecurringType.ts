import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('statement_recurring_types')
export class StatementRecurringType {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	alias: string;

	@Column()
	name: string;
}
