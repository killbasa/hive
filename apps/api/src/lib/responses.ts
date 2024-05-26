/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

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
