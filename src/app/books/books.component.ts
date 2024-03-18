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
	isBooksOverLimit:boolean;

	constructor() { 
		let json = require('../shared/test-data.json');
		this._books = json.books;
		this.isBooksOverLimit = this._books.length > this.bookDisplayLimit;
		console.log(this._books);
	}

	ngOnInit(): void { }

	public get books():Book[] { 
		return this._books.filter((item, index) => index < this.bookDisplayLimit);
	}

	loadMoreBooks():void {
		this.bookDisplayLimit += 20;
		this.isBooksOverLimit = this._books.length > this.bookDisplayLimit;
	}
}
