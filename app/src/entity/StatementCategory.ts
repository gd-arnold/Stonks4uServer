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

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	deletedAt?: Date;
}
