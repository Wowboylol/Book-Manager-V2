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
	books:Book[] = [];

	constructor() { 
		let json = require('../shared/test-data.json');
		this.books = json.books;
		console.log(this.books);
	}
	ngOnInit(): void { }
}
