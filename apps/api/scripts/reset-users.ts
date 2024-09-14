import { db } from './load-db';
import * as schema from '../src/db/schema';

await db.delete(schema.users);
