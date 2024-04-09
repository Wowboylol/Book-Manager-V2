import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';
import { testData } from 'src/test-data/test-data';
import { Book } from '../models/book.model';

describe('BookService', () => {
  	let service: BookService;
	let controlGroup: Book[];
	let newBook: Book;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(BookService);
		service['books'] = structuredClone(testData.books);
		controlGroup = structuredClone(testData.books);
		newBook = new Book(
			-1,
			'New Book',
			'This is the description for New Book.',
			'https://new-book.com',
			'https://new-book.com/image.jpg',
			4,
			null, null,
			['new', 'book'],
			null
		);
	});

	it('should return all books', () => {
		expect(service.getAllBooks()).toEqual(controlGroup);
	});

	it('should return a book by ID', () => {
		expect(service.getBookById(3)).toEqual(controlGroup[3]);
	});

	it('should return undefined for a book that does not exist', () => {
		expect(service.getBookById(-1)).toBeUndefined();
	});

	it('should update all books with the given tag name to the new tag name', () => {
		service.updateTagInBooks('tESt', 'new');
		controlGroup[0].tags = ['new', 'book', 'zero'];
		controlGroup[2].tags = ['book', 'two', 'new'];
		expect(service.getAllBooks()).toEqual(controlGroup);
	});

	it('should delete the tag with the given name from all books', () => {
		service.deleteTagFromBooks('tWO');
		controlGroup[2].tags = ['book', 'test'];
		expect(service.getAllBooks()).toEqual(controlGroup);
	});

	it('should delete the book with the given ID', () => {
		service.deleteBook(1);
		controlGroup.splice(1, 1);
		expect(service.getAllBooks()).toEqual(controlGroup);
	});

	it('should add a new book with the given data and update necessary data', () => {
		service.addBook(newBook);
		controlGroup.push(newBook);
		expect(service.getAllBooks()).toEqual(controlGroup);
		expect(service.getBookById(6).dateCreated).not.toBeNull();
		expect(service.getBookById(6).dateUpdated).toEqual(service.getBookById(6).dateCreated);
		expect(service.getBookById(6).collection).toEqual('None');
	});

	it('should update the book with the given updated book and update necessary data', () => {
		newBook.id = 3;
		service.updateBook(newBook);
		controlGroup[3] = newBook;
		expect(service.getAllBooks()).toEqual(controlGroup);
		expect(service.getBookById(3).dateUpdated).not.toBeNull();
	});
});
