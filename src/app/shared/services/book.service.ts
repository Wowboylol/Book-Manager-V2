import { Injectable } from '@angular/core';

import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService 
{
	private books:Book[] = [];

	constructor() { 
		let json = require('../test-data.json');
		this.books = json.books.reverse();
		console.log(this.books);
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
