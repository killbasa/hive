import { getPaginationPages } from './navigation';

describe('navigation utils', () => {
	describe('getPaginationPages', () => {
		it('page 1, last 10', () => {
			const result = getPaginationPages(1, 10);
			expect(result).toStrictEqual([1, 2, 3, 4, null, 10]);
		});

		it('page 10, last 10', () => {
			const result = getPaginationPages(10, 10);
			expect(result).toStrictEqual([1, null, 7, 8, 9, 10]);
		});

		it('page 5, last 10', () => {
			const result = getPaginationPages(5, 10);
			expect(result).toStrictEqual([1, null, 4, 5, 6, null, 10]);
		});

		it('page 1, last 1', () => {
			const result = getPaginationPages(1, 1);
			expect(result).toStrictEqual([1]);
		});

		it('page 1, last 4', () => {
			const result = getPaginationPages(1, 4);
			expect(result).toStrictEqual([1, 2, 3, 4]);
		});

		it('page 1, last 5', () => {
			const result = getPaginationPages(1, 5);
			expect(result).toStrictEqual([1, 2, 3, 4, 5]);
		});
	});
});
