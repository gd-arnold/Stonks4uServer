import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

export type StatementCategoryTypeType = 'income' | 'expense';

@Entity('statement_categories')
export class StatementCategory {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({
		type: 'enum',
		enum: ['income', 'expense'],
	})
	type: StatementCategoryTypeType;

	@ManyToOne(() => User, (user) => user.statementCategories, {
		nullable: true,
	})
	user: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
