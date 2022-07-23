import { PostgreSqlContainer, StartedPostgreSqlContainer } from 'testcontainers';
import { AppDataSource } from '../../config/data-source';

export class TestDBContainer {
	stoppedContainer: PostgreSqlContainer;
	startedContainer: StartedPostgreSqlContainer;

	constructor() {
		this.stoppedContainer = new PostgreSqlContainer('postgres:14');
	}

	async start() {
		this.startedContainer = await this.stoppedContainer.start();

		AppDataSource.setOptions({
			host: this.startedContainer.getHost(),
			port: this.startedContainer.getPort(),
			username: this.startedContainer.getUsername(),
			password: this.startedContainer.getPassword(),
			database: this.startedContainer.getDatabase(),
		});
	}

	async stop() {
		await this.startedContainer.stop();
	}
}
