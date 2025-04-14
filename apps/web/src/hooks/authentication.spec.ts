import type { DeepPartial } from '@hive/common';
import { authentication } from './authentication';

const mocks = vi.hoisted(() => {
	return {
		redirect: vi.fn(),
	};
});

vi.mock('@sveltejs/kit', () => {
	return {
		redirect: mocks.redirect,
	};
});

describe('authentication hook', async () => {
	it('should resolve for unauthenticated to login page', async () => {
		const arg = {
			event: {
				cookies: { get: () => undefined },
				request: { url: 'https://localhost/login' },
			},
			resolve: vi.fn(),
		} satisfies DeepPartial<Parameters<typeof authentication>[0]>;

		await authentication(arg as never);

		expect(arg.resolve).toHaveBeenCalledWith(arg.event);
	});

	it('should redirect for unauthenticated to non-login page', async () => {
		const arg = {
			event: {
				cookies: { get: () => undefined },
				request: { url: 'https://localhost/channels' },
			},
			resolve: vi.fn(),
		} satisfies DeepPartial<Parameters<typeof authentication>[0]>;

		await authentication(arg as never);

		expect(mocks.redirect).toHaveBeenCalledWith(307, '/login');
	});

	it('should redirect for authenticated to login page', async () => {
		const arg = {
			event: {
				cookies: { get: () => 'cookie' },
				request: { url: 'https://localhost/login' },
			},
			resolve: vi.fn(),
		} satisfies DeepPartial<Parameters<typeof authentication>[0]>;

		await authentication(arg as never);

		expect(mocks.redirect).toHaveBeenCalledWith(307, '/');
	});

	it('should resolve all other requests', async () => {
		const arg = {
			event: {
				cookies: { get: () => 'cookie' },
				request: { url: 'https://localhost/channels' },
			},
			resolve: vi.fn(),
		} satisfies DeepPartial<Parameters<typeof authentication>[0]>;

		await authentication(arg as never);

		expect(arg.resolve).toHaveBeenCalledWith(arg.event);
	});
});
