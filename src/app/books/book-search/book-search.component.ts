import { OnInit, Component, ElementRef, EventEmitter, Output, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BookSearchQuery } from 'src/app/shared/models/book-search-query.model';

@Component({
	selector: 'app-book-search',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './book-search.component.html',
	styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit, AfterViewInit
{
	@ViewChild('searchString') searchStringRef:ElementRef;
	@ViewChild('searchType') searchTypeRef:ElementRef;
	@ViewChild('searchSort') searchSortRef:ElementRef;
	@ViewChild('searchOrder') searchOrderRef:ElementRef;
	@Output() searchQuery = new EventEmitter<BookSearchQuery>();
	routeQuery: BookSearchQuery;

	constructor(private route: ActivatedRoute, private renderer: Renderer2) { }

	ngOnInit(): void { 
		// Get search query from route if available, otherwise emit default search query
		if(Object.keys(this.route.snapshot.queryParams).length > 0) {
			this.routeQuery = {
				searchString: this.route.snapshot.queryParams.searchString,
				searchType: +this.route.snapshot.queryParams.searchType,
				searchSort: +this.route.snapshot.queryParams.searchSort,
				searchOrder: +this.route.snapshot.queryParams.searchOrder
			};
			this.searchQuery.emit(this.routeQuery);
		}
		else {
			this.routeQuery = { searchString: "", searchType: 0, searchSort: 0, searchOrder: 0 };
			this.searchQuery.emit(this.routeQuery);
		}
	}

	ngAfterViewInit(): void {
		this.renderer.setProperty(this.searchStringRef.nativeElement, 'value', this.routeQuery.searchString);
		this.renderer.setProperty(this.searchTypeRef.nativeElement, 'value', this.routeQuery.searchType);
		this.renderer.setProperty(this.searchSortRef.nativeElement, 'value', this.routeQuery.searchSort);
		this.renderer.setProperty(this.searchOrderRef.nativeElement, 'value', this.routeQuery.searchOrder);
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
