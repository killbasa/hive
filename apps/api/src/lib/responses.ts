import { Type } from '@fastify/type-provider-typebox';

export const EmptyResponse = (description: string) =>
	Type.Null({
		description,
	});

export const MessageResponse = (description: string) =>
	Type.Object(
		{
			message: Type.String(),
		},
		{ description },
	);
