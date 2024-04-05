import { Tag } from '../models/tag.model';
import { TagSearchPipe } from './tag-search.pipe';
import { testData } from '../../../../src/test-data/test-data';

describe('TagSearchPipe', () => {
	let tagSearchPipe: TagSearchPipe;
	let testTags: Tag[];
	let testSearchCount;

	beforeEach(() => {
		tagSearchPipe = new TagSearchPipe();
		testTags = testData.tags.slice();
		testSearchCount = { value: 0 };
	});

	it('returns all tags in alphabetical order when default search query (name, alphabetical, ascending) is used', () => {
		const searchQuery = { searchString: '', searchSort: 0, searchOrder: 1 };
		const result = tagSearchPipe.transform(testTags, searchQuery, testSearchCount);
		expect(result).toEqual([
			testTags[1], testTags[8], testTags[9], testTags[6], testTags[3], 
			testTags[0], testTags[7], testTags[5], testTags[4], testTags[2]]);
		expect(testSearchCount.value).toBe(testTags.length);
	});

	it('filters tags by tag name through search string (case-insensitive)', () => {
		const searchQuery = { searchString: 'BoOk', searchSort: 0, searchOrder: 1 };
		const result = tagSearchPipe.transform(testTags, searchQuery, testSearchCount);
		expect(result).toEqual([testTags[1], testTags[7]]);
		expect(testSearchCount.value).toBe(2);
	});

	it('sorts books by alphabetical descending order', () => {
		const searchQuery = { searchString: '', searchSort: 0, searchOrder: 0 };
		const result = tagSearchPipe.transform(testTags, searchQuery, testSearchCount);
		expect(result).toEqual([
			testTags[2], testTags[4], testTags[5], testTags[7], testTags[0], 
			testTags[3], testTags[6], testTags[9], testTags[8], testTags[1]]);
		expect(testSearchCount.value).toBe(testTags.length);
	});

	it('sorts books by usage amount ascending order', () => {
		const searchQuery = { searchString: '', searchSort: 1, searchOrder: 1 };
		const result = tagSearchPipe.transform(testTags, searchQuery, testSearchCount);
		expect(testSearchCount.value).toBe(testTags.length);
		expect(result[8]).toEqual(testTags[0]);
		expect(result[9]).toEqual(testTags[1]);
	});

	it('sorts books by usage amount descending order', () => {
		const searchQuery = { searchString: '', searchSort: 1, searchOrder: 0 };
		const result = tagSearchPipe.transform(testTags, searchQuery, testSearchCount);
		expect(testSearchCount.value).toBe(testTags.length);
		expect(result[0]).toEqual(testTags[1]);
		expect(result[1]).toEqual(testTags[0]);
	});
});
