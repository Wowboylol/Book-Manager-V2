import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagSearchQuery } from 'src/app/shared/models/tag-search-query.model';

@Component({
	selector: 'app-tag-search',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tag-search.component.html',
	styleUrls: ['./tag-search.component.css']
})
export class TagSearchComponent implements OnInit 
{
	@ViewChild('searchString') searchStringRef:ElementRef;
	@ViewChild('searchSort') searchSortRef:ElementRef;
	@ViewChild('searchOrder') searchOrderRef:ElementRef;
	@Output() searchQuery = new EventEmitter<TagSearchQuery>();

	constructor() { }

	ngOnInit(): void { 
		this.searchQuery.emit({ searchString: "", searchSort: 0, searchOrder: 1 });
	}

	onSubmitSearch()
	{
		const searchString:string = this.searchStringRef.nativeElement.value;
		const searchSort:number = +this.searchSortRef.nativeElement.value;
		const searchOrder:number = +this.searchOrderRef.nativeElement.value;
		this.searchQuery.emit({ searchString, searchSort, searchOrder });
	}
}
