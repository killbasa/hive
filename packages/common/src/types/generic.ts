import { Type } from '@fastify/type-provider-typebox';
import type { TLiteral, TUnion } from '@sinclair/typebox';

export type Awaitable<T> = Promise<T> | T;

export type TLiteralUnion<T extends string[], Acc extends TLiteral[] = []> = T extends [infer L extends string, ...infer R extends string[]]
	? TLiteralUnion<R, [...Acc, TLiteral<L>]>
	: TUnion<Acc>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function LiteralUnion<T extends string[]>(values: readonly [...T]) {
	return Type.Union(values.map((value) => Type.Literal(value)));
}
