import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';
import { BookSearchComponent } from './book-search/book-search.component';
import { BookItemComponent } from './book-item/book-item.component';
import { Book } from '../shared/models/book.model';
import { BookService } from '../shared/services/book.service';
import { BookSearchQuery } from '../shared/models/book-search-query.model';
import { BookSearchPipe } from '../shared/pipes/book-search.pipe';
import { AlertComponent } from '../shared/components/alert/alert.component';
import { BookDisplayType } from './book-display-type.model';
import { ViewportDetectDirective } from '../shared/directives/viewport-detect.directive';

@Component({
	selector: 'app-books',
	standalone: true,
	imports: [CommonModule, BookSearchComponent, BookItemComponent, RouterModule, BookSearchPipe, AlertComponent, ViewportDetectDirective],
	templateUrl: './books.component.html',
	styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, OnDestroy 
{
	private booksChangedSubscription: Subscription;

	// Book display
	books: Book[] = [];
	bookDisplayLimit: number;

	// Search data
	searchQuery: BookSearchQuery;
	searchCount = { value: 0 };

	// Others
	alertToggle: string = 'hidden';
	readonly displayEnum = BookDisplayType;
	displayType: BookDisplayType = BookDisplayType.Grid;
	scrollButtonDirectionUp: boolean = false;

	constructor(private bookService: BookService) { }

	ngOnInit(): void 
	{ 
		// Set default data
		this.resetBookDisplayLimit();
		this.books = this.bookService.getAllBooks();
		this.searchCount.value = this.books.length;

		// Subscribe to book changes
		this.booksChangedSubscription = this.bookService.booksChanged
			.subscribe((books: Book[]) => {
				this.books = books;
				this.searchCount.value = this.books.length;
			}
		);
	}

	ngOnDestroy(): void {
		this.booksChangedSubscription.unsubscribe();
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
		if(this.alertToggle === 'hidden')
		{
			this.alertToggle = 'show';
			setTimeout(() => {
				this.alertToggle = 'hidden';
			}, 3000);			
		}
	}

	// Changes the display type
	changeDisplayType(): void {
		this.displayType = this.displayType === BookDisplayType.Grid ? BookDisplayType.List : BookDisplayType.Grid;
	}

	// Scrolls the page to the top or bottom
	scrollPage(): void {
		if(this.scrollButtonDirectionUp) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
		else {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
		}
	}
}
