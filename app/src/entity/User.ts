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
	id: string;

	@Column()
	fullName: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@Column({
		type: 'decimal',
		precision: 11,
		scale: 2,
		nullable: true,
	})
	balance: number;

	@OneToMany(() => StatementCategory, (category) => category.user)
	statementCategories: StatementCategory[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
