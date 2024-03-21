import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Book } from '../../shared/models/book.model';

@Component({
	selector: 'app-book-item',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './book-item.component.html',
	styleUrls: ['./book-item.component.css']
})
export class BookItemComponent implements OnInit 
{
	@Input() book:Book;
	stars:number[] = [1, 2, 3, 4, 5];

	constructor() { }
	ngOnInit(): void { }
}
