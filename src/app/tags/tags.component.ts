import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagSearchComponent } from './tag-search/tag-search.component';

@Component({
	selector: 'app-tags',
	standalone: true,
	imports: [CommonModule, TagSearchComponent],
	templateUrl: './tags.component.html',
	styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit 
{
	constructor() { }
	ngOnInit(): void { }
}
