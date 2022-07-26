import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Statement } from './Statement';

@Entity('processed_statements')
export class ProcessedStatement {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Statement, (statement) => statement.processes)
	statement: Statement;

	@Column({
		type: 'decimal',
		precision: 11,
		scale: 2,
	})
	amount: number;

	@CreateDateColumn()
	processedOn: Date;
}
