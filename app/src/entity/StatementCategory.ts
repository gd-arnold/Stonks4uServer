import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Statement } from './Statement';
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

	@OneToMany(() => Statement, (statement) => statement.category)
	statements: Statement[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
