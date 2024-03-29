import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-tag-search',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tag-search.component.html',
	styleUrls: ['./tag-search.component.css']
})
export class TagSearchComponent implements OnInit 
{
	constructor() { }
	ngOnInit(): void { }
}
