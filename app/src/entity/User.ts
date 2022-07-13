import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { StatementCategory } from './StatementCategory';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: number;

	@Column()
	fullName: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@OneToMany(() => StatementCategory, (category) => category.user)
	statementCategories: StatementCategory[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
