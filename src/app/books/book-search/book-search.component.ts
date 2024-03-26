import { OnInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookSearchQuery } from 'src/app/shared/models/book-search-query.model';

@Component({
	selector: 'app-book-search',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './book-search.component.html',
	styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit
{
	@ViewChild('searchString') searchStringRef:ElementRef;
	@ViewChild('searchType') searchTypeRef:ElementRef;
	@ViewChild('searchSort') searchSortRef:ElementRef;
	@ViewChild('searchOrder') searchOrderRef:ElementRef;
	@Output() searchQuery = new EventEmitter<BookSearchQuery>();

	constructor() { }

	ngOnInit(): void { 
		this.searchQuery.emit({ searchString: "", searchType: 0, searchSort: 0, searchOrder: 0 });
	}

	onSubmitSearch()
	{
		const searchString:string = this.searchStringRef.nativeElement.value;
		const searchType:number = +this.searchTypeRef.nativeElement.value;
		const searchSort:number = +this.searchSortRef.nativeElement.value;
		const searchOrder:number = +this.searchOrderRef.nativeElement.value;
		this.searchQuery.emit({ searchString, searchType, searchSort, searchOrder });
	}
}
