import { Type } from '@fastify/type-provider-typebox';
import type { TLiteral, TUnion } from '@fastify/type-provider-typebox';

export type TLiteralUnion<T extends string[], Acc extends TLiteral[] = []> = T extends [infer L extends string, ...infer R extends string[]]
	? TLiteralUnion<R, [...Acc, TLiteral<L>]>
	: TUnion<Acc>;

export function LiteralUnion<T extends string[]>(values: readonly [...T]): TLiteralUnion<T> {
	return Type.Union(values.map((value) => Type.Literal(value))) as never;
}
