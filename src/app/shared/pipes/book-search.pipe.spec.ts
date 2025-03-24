import { Book } from '../models/book.model';
import { BookSearchPipe } from './book-search.pipe';
import { testData } from '../../../../src/test-data/test-data';

describe('BookSearchPipe', () => {
	let bookSearchPipe: BookSearchPipe;
	let testBooks: Book[];
	let testSearchCount;

	beforeEach(() => {
		bookSearchPipe = new BookSearchPipe();
		testBooks = testData.books.slice();
		testSearchCount = { value: 0 };
	});

	it('returns all books reversed when default search query (name, dateAdded, descending) is used', () => {
		const searchQuery = { searchString: '', searchType: 0, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual(testBooks.reverse());
		expect(testSearchCount.value).toBe(testBooks.length);
	});

	it('filters books by name', () => {
		const searchQuery = { searchString: 'Test', searchType: 0, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[2], testBooks[0]]);
		expect(testSearchCount.value).toBe(2);
	});

	it('filters books by tag', () => {
		const searchQuery = { searchString: 'test', searchType: 1, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[2], testBooks[0]]);
		expect(testSearchCount.value).toBe(2);
	});

	it('filters books by collection', () => {
		const searchQuery = { searchString: 'None', searchType: 2, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[5], testBooks[4], testBooks[1]]);
		expect(testSearchCount.value).toBe(3);
	});

	it('sorts books by dateAdded ascending', () => {
		const searchQuery = { searchString: '', searchType: 0, searchSort: 0, searchOrder: 1 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual(testBooks);
		expect(testSearchCount.value).toBe(testBooks.length);
	});

	it('sorts books by dateUpdated descending', () => {
		const searchQuery = { searchString: '', searchType: 0, searchSort: 1, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[5], testBooks[1], testBooks[4], testBooks[3], testBooks[2], testBooks[0]]);
		expect(testSearchCount.value).toBe(testBooks.length);
	});

	it('sorts books by dateUpdated ascending', () => {
		const searchQuery = { searchString: '', searchType: 0, searchSort: 1, searchOrder: 1 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[0], testBooks[2], testBooks[3], testBooks[4], testBooks[1], testBooks[5]]);
		expect(testSearchCount.value).toBe(testBooks.length);
	});

	it('sorts books by alphabetical descending', () => {
		const searchQuery = { searchString: '', searchType: 0, searchSort: 2, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[3], testBooks[2], testBooks[0], testBooks[5], testBooks[4], testBooks[1]]);
		expect(testSearchCount.value).toBe(testBooks.length);
	});

	it('sorts books by alphabetical ascending', () => {
		const searchQuery = { searchString: '', searchType: 0, searchSort: 2, searchOrder: 1 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[1], testBooks[4], testBooks[5], testBooks[0], testBooks[2], testBooks[3]]);
		expect(testSearchCount.value).toBe(testBooks.length);
	});

	it('sorts books by rating descending', () => {
		const searchQuery = { searchString: '', searchType: 0, searchSort: 3, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[3], testBooks[5], testBooks[1], testBooks[4], testBooks[0], testBooks[2]]);
		expect(testSearchCount.value).toBe(testBooks.length);
	});

	it('sorts books by rating ascending', () => {
		const searchQuery = { searchString: '', searchType: 0, searchSort: 3, searchOrder: 1 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[2], testBooks[4], testBooks[0], testBooks[5], testBooks[1], testBooks[3]]);
		expect(testSearchCount.value).toBe(testBooks.length);
	});

	it('filters books by excluding tags', () => {
		const searchQuery = { searchString: '-test, -textbook', searchType: 1, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[4], testBooks[3], testBooks[1]]);
		expect(testSearchCount.value).toBe(3);
	});

	it('filters books by including and excluding tags', () => {
		const searchQuery = { searchString: 'book, test, -zero', searchType: 1, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[2]]);
		expect(testSearchCount.value).toBe(1);
	});

	it('filters books by ID', () => {
		const searchQuery = { searchString: '2', searchType: 3, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[2]]);
		expect(testSearchCount.value).toBe(1);
	});

	it('filters books by mix of valid and invalid IDs', () => {
		const searchQuery = { searchString: '1,  ,2 , test, -5 , 5, >-0, <-3,>4', searchType: 3, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[5], testBooks[4], testBooks[2], testBooks[1]]);
		expect(testSearchCount.value).toBe(4);
	});

	it('filters books by range of IDs', () => {
		const searchQuery = { searchString: '>2 ,  <4', searchType: 3, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[4], testBooks[3], testBooks[2]]);
		expect(testSearchCount.value).toBe(3);
	});

	it('filters books by specific IDs and range of IDs', () => {
		const searchQuery = { searchString: '0 , 2,  >4', searchType: 3, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[5], testBooks[4], testBooks[2], testBooks[0]]);
		expect(testSearchCount.value).toBe(4);
	});

	it('filters books by overlapping ranges and specific ID', () => {
		const searchQuery = { searchString: '<4, 5,>2,<3, >1', searchType: 3, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[5], testBooks[3], testBooks[2]]);
		expect(testSearchCount.value).toBe(3);
	});

	it('filters books correctly with duplicate search conditions', () => {
		const searchQuery = { searchString: '1,1,1, >2,<3,<3,>2,1', searchType: 3, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([testBooks[3], testBooks[2], testBooks[1]]);
		expect(testSearchCount.value).toBe(3);
	});

	it('filters out all books if there are no matching IDs', () => {
		const searchQuery = { searchString: '7, >2, -4, <1', searchType: 3, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([]);
		expect(testSearchCount.value).toBe(0);
	});

	it('filters out all books if search conditions are all invalid', () => {
		const searchQuery = { searchString: '-5, 20000, <-2, >-90', searchType: 3, searchSort: 0, searchOrder: 0 };
		const result = bookSearchPipe.transform(testBooks, searchQuery, testSearchCount);
		expect(result).toEqual([]);
		expect(testSearchCount.value).toBe(0);
	});
});
