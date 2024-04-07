import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-book-edit',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './book-edit.component.html',
	styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit 
{
	overlayTitle = 'Edit Book';

	constructor() { }
	ngOnInit(): void { }
}
