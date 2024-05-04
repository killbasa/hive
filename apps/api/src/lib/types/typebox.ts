/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Type } from '@fastify/type-provider-typebox';
import type { TSchema } from '@fastify/type-provider-typebox';

export const HiveType = {
	LiteralUnion<T extends string[]>(values: readonly [...T]) {
		return Type.Union(values.map((value) => Type.Literal(value)));
	},
	Nullable<T extends TSchema>(schema: T) {
		return Type.Union([Type.Null(), schema]);
	}
};
