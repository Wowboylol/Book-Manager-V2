import { Injectable } from '@angular/core';

import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService 
{
	private books:Book[] = [];

	constructor() { 
		let json = require('../../../test-data/book-snippet.json');
		this.books = json.books;
		this.books = this.convertBookDates(this.books);
	}

	// Converts book date strings into Date objects
	// If the date string is null, the date is set to null
	private convertBookDates(books:Book[]):Book[] {
		return books.map(book => {
			book.dateCreated = book.dateCreated ? new Date(book.dateCreated) : null;
			book.dateUpdated = book.dateUpdated ? new Date(book.dateUpdated) : null;
			return book;
		});
	}

	// Return a copy of the array of books
	getAllBooks():Book[] {
		return this.books.slice();
	}

	// Return the book with the given ID, or undefined if not found
	getBookById(id:number):Book {
		return this.books.find(book => book.id === id); 
	}
}
