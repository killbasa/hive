/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { Type } from '@fastify/type-provider-typebox';
import type { TLiteral, TSchema, TUnion } from '@fastify/type-provider-typebox';

type IntoStringLiteralUnion<T> = { [K in keyof T]: T[K] extends string ? TLiteral<T[K]> : never };

export const HiveType = {
	LiteralUnion<T extends string[]>(values: readonly [...T]): TUnion<IntoStringLiteralUnion<T>> {
		return Type.Union(values.map((value) => Type.Literal(value))) as any;
	},
	Nullable<T extends TSchema>(schema: T) {
		return Type.Union([Type.Null(), schema]);
	},
};
