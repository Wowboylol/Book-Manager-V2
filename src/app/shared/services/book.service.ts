import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class BookService 
{
	private books: Book[] = [];
	booksChanged = new Subject<Book[]>();

	constructor() { }

	// Return a copy of the array of books
	getAllBooks(): Book[] {
		return this.books.slice();
	}

	// Set current books to the given array of books
	setBooks(books: Book[]): void {
		this.books = books;
		this.booksChanged.next(this.books.slice());
	}

	// Return the book with the given ID, or undefined if not found
	getBookById(id: number): Book {
		return this.books.find(book => book.id === id); 
	}

	// Returns the books with the given tag name (case-insensitive)
	getBooksByTag(tagName: string): Book[] {
		var tagNameLower = tagName.toLowerCase();
		return this.books.filter(book => book.tags.map(tag => tag.toLowerCase()).includes(tagNameLower));
	}

	// Returns the books with the given collection name (case-insensitive)
	getBooksByCollection(collectionName: string): Book[] {
		var collectionNameLower = collectionName.toLowerCase();
		return this.books.filter(book => book.collection.toLowerCase() === collectionNameLower);
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
				if(!newBook.collection) { newBook.collection = 'None'; }
				this.books[bookIndex] = newBook;
				this.booksChanged.next(this.books.slice());
			}
			else { throw new Error('Book not found'); }
		}
		catch(e) {
			console.error(e);
		}
	}

	// Update all books with the given tag name to the new tag name (case-insensitive)
	updateTagInBooks(oldName: string, newName: string): void {
		this.books.forEach(book => {
			var oldNameLower = oldName.toLowerCase();
			book.tags = book.tags.map(tag => tag.toLowerCase() === oldNameLower ? newName : tag);
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

	// Delete the collection with the given name from all books (case-insensitive)
	deleteCollectionFromBooks(collectionName: string): void {
		this.books.forEach(book => {
			if(book.collection.toLowerCase() === collectionName.toLowerCase()) {
				book.collection = 'None';
			}
		});
		this.booksChanged.next(this.books.slice());
	}
}
