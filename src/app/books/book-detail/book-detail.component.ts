import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-book-detail',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit 
{
	constructor() { }
	ngOnInit(): void { }
}
