import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BookSearchComponent } from './book-search/book-search.component';
import { BookItemComponent } from './book-item/book-item.component';
import { Book } from '../shared/models/book.model';
import { BookService } from '../shared/services/book.service';
import { BookSearchQuery } from '../shared/models/book-search-query.model';
import { BookSearchPipe } from '../shared/pipes/book-search.pipe';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
	selector: 'app-books',
	standalone: true,
	imports: [CommonModule, BookSearchComponent, BookItemComponent, RouterModule, BookSearchPipe, AlertComponent],
	templateUrl: './books.component.html',
	styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit 
{
	books:Book[] = [];
	bookDisplayLimit:number;
	searchQuery:BookSearchQuery;
	searchCount = { value: 0 };
	alertToggle:string = 'hidden';

	constructor(private bookService: BookService) { }

	ngOnInit(): void { 
		this.resetBookDisplayLimit();
		this.books = this.bookService.getAllBooks();
		this.searchCount.value = this.books.length;
	}

	// Resets book display limit to default
	resetBookDisplayLimit(): void {
		this.bookDisplayLimit = 10;
	}

	// Increases the display limit to show more books
	loadMoreBooks(): void {
		this.bookDisplayLimit += 20;
	}

	// Updates the search query
	onSearchQuery(searchQuery:BookSearchQuery): void {
		this.searchQuery = searchQuery;
		this.resetBookDisplayLimit();
		this.runAlert();
	}

	// Runs the alert component animation
	runAlert(): void {
		this.alertToggle = 'show';
		setTimeout(() => {
			this.alertToggle = 'hidden';
		}, 3000);
	}
}
