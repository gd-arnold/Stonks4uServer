import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

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

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
