import { HiveType } from './typebox.js';
import { expectTypeOf } from 'vitest';
import { Type } from '@fastify/type-provider-typebox';
import type { Static } from '@fastify/type-provider-typebox';

describe('HiveType', () => {
	it('LiteralUnion creates a union of literals from an array of strings', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const schema = HiveType.LiteralUnion(['a', 'b', 'c']);
		type SchemaType = Static<typeof schema>;

		expectTypeOf<SchemaType>().toEqualTypeOf<'a' | 'b' | 'c'>();
	});

	it('Nullable creates a union with null', () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const schema = HiveType.Nullable(Type.String());
		type SchemaType = Static<typeof schema>;

		expectTypeOf<SchemaType>().toEqualTypeOf<string | null>();
	});
});
