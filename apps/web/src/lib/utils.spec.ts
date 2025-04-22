import { formatLinks, formatTimestamps } from './utils';

describe('utils', () => {
	describe('formatLinks', () => {
		it('should replace anchors', () => {
			const result = formatLinks('https://www.youtube.com/@FuriFerntail');
			expect(result).toBe(
				'<a href="https://www.youtube.com/@FuriFerntail" target="_blank" class="link link-primary">https://www.youtube.com/@FuriFerntail</a>',
			);
		});

		it('should replace hashtags', () => {
			const result = formatLinks('#FuriFerntail');
			expect(result).toBe(
				'<a href="https://www.youtube.com/hashtag/FuriFerntail" target="_blank" class="link link-primary">#FuriFerntail</a>',
			);
		});

		it('should replace @s', () => {
			const result = formatLinks('@FuriFerntail');
			expect(result).toBe(
				'<a href="https://www.youtube.com/@FuriFerntail" target="_blank" class="link link-primary">@FuriFerntail</a>',
			);
		});

		it('should work with multiline strings', () => {
			const input = `Multiline test
https://google.com
#FuriFuriFuri
@FuriFerntail`;

			const output = `Multiline test
<a href="https://google.com" target="_blank" class="link link-primary">https://google.com</a>
<a href="https://www.youtube.com/hashtag/FuriFuriFuri" target="_blank" class="link link-primary">#FuriFuriFuri</a>
<a href="https://www.youtube.com/@FuriFerntail" target="_blank" class="link link-primary">@FuriFerntail</a>`;

			const result = formatLinks(input);
			expect(result).toBe(output);
		});
	});

	describe('formatTimestamps', () => {
		it('should format hh:mm:ss', () => {
			const result = formatTimestamps('test-id', '4:01:33');
			expect(result).toBe(
				'<a href="/ui/watch/test-id?t=14493" class="link link-primary">4:01:33</a>',
			);
		});

		it('should format m:ss', () => {
			const result = formatTimestamps('test-id', '0:41');
			expect(result).toBe(
				'<a href="/ui/watch/test-id?t=41" class="link link-primary">0:41</a>', //
			);
		});

		it('should format mm:ss', () => {
			const result = formatTimestamps('test-id', '13:41');
			expect(result).toBe(
				'<a href="/ui/watch/test-id?t=821" class="link link-primary">13:41</a>',
			);
		});

		it('should not format with ss', () => {
			const result = formatTimestamps('test-id', '37');
			expect(result).toBe('37');
		});
	});
});
