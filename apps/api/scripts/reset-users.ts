import { db } from './load-db.js';
import * as schema from '../src/db/schema.js';

await db.delete(schema.users);
await db.delete(schema.apikeys);
