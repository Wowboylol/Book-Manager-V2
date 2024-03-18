import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookSearchComponent } from './book-search/book-search.component';
import { BookItemComponent } from './book-item/book-item.component';
import { Book } from '../shared/models/book.model';

@Component({
	selector: 'app-books',
	standalone: true,
	imports: [CommonModule, BookSearchComponent, BookItemComponent],
	templateUrl: './books.component.html',
	styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit 
{
	private _books:Book[] = [];
	bookDisplayLimit:number = 10;

	constructor() { 
		let json = require('../shared/test-data.json');
		this._books = json.books;
		console.log(this._books);
	}

	ngOnInit(): void { }

	// Returns a subset of books based on the current display limit using getter wrapper
	public get books():Book[] { 
		return this._books.filter((item, index) => index < this.bookDisplayLimit);
	}

	// Returns the length of the full list of books
	getFullBookListLength():number {
		return this._books.length;
	}

	// Increases the display limit to show more books
	loadMoreBooks():void {
		this.bookDisplayLimit += 20;
	}
}
