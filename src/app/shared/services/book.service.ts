import { Injectable } from '@angular/core';

import { Book } from '../models/book.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService 
{
	private books: Book[] = [];
	booksChanged = new Subject<Book[]>();

	constructor() { 
		let json = require('../../../test-data/complete-data.json');
		this.books = json.books;
		this.books = this.convertBookDates(this.books);
	}

	// Converts book date strings into Date objects
	// If the date string is null, the date is set to null
	private convertBookDates(books: Book[]): Book[] {
		return books.map(book => {
			book.dateCreated = book.dateCreated ? new Date(book.dateCreated) : null;
			book.dateUpdated = book.dateUpdated ? new Date(book.dateUpdated) : null;
			return book;
		});
	}

	// Return a copy of the array of books
	getAllBooks(): Book[] {
		return this.books.slice();
	}

	// Return the book with the given ID, or undefined if not found
	getBookById(id: number): Book {
		return this.books.find(book => book.id === id); 
	}

	// Update all books with the given tag name to the new tag name (case-insensitive)
	updateTagInBooks(oldName: string, newName: string): void {
		this.books.forEach(book => {
			book.tags = book.tags.map(tag => tag.toLowerCase() === oldName.toLowerCase() ? newName : tag);
		});
		this.booksChanged.next(this.books.slice());
	}

	// Delete the tag with the given name from all books (case-insensitive)
	deleteTagFromBooks(tagName: string): void {
		this.books.forEach(book => {
			book.tags = book.tags.filter(tag => tag.toLowerCase() !== tagName.toLowerCase());
		});
		this.booksChanged.next(this.books.slice());
	}

	// Delete the book with the given ID
	// Postcondition: The deleted book should be removed from all tags
	deleteBook(id: number): void {
		this.books = this.books.filter(book => book.id !== id);
		this.booksChanged.next(this.books.slice());
	}

	// Add a new book with the given data and update necessary data
	// Postcondition: The tags linked to the book should be updated
	addBook(book: Book): void {
		book.id = this.books.length ? Math.max(...this.books.map(book => book.id)) + 1 : 0;
		book.dateCreated = new Date();
		book.dateUpdated = book.dateCreated;
		if(!book.collection) { book.collection = 'None'; }

		this.books.push(book);
		this.booksChanged.next(this.books.slice());
	}

	// Update the book with the given updated book and update necessary data
	// Postcondition: The tags linked to the book should be updated (new tags should be added, old tags should be removed)
	updateBook(newBook: Book): void {
		let bookIndex = this.books.findIndex(book => book.id === newBook.id);
		try{
			if(bookIndex !== -1) {
				newBook.dateUpdated = new Date();
				this.books[bookIndex] = newBook;
				this.booksChanged.next(this.books.slice());
			}
			else { throw new Error('Book not found'); }
		}
		catch(e) {
			console.error(e);
		}
	}
}
