import { Injectable } from '@angular/core';

import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService 
{
	private books:Book[] = [];

	constructor() { 
		let json = require('../test-data.json');
		this.books = json.books;
		console.log(this.books);
	}

	getAllBooks():Book[] {
		return this.books.slice();
	}

	getBookById(id:number):Book {
		return this.books.find(book => book.id === id); 
	}
}
