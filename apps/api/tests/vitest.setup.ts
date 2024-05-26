import { db, initDb } from '../src/db/client.js';
import { users } from '../src/db/schema.js';
import { routes } from '../src/routes.js';
import { buildServer } from '../src/server.js';

const server = await buildServer();
await server.register(routes);

initDb();

await db
	.insert(users)
	.values([
		{ name: 'test-apikey', password: 'test', apiKey: 'test' },
		{ name: 'test-noapikey', password: 'test' },
	])
	.execute();

beforeAll(async () => {
	await server.ready();
});

afterAll(async () => {
	await server.close();
});

export default server;
