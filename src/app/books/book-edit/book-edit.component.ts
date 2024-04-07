import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Book } from 'src/app/shared/models/book.model';
import { BookService } from 'src/app/shared/services/book.service';

@Component({
	selector: 'app-book-edit',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './book-edit.component.html',
	styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit 
{
	// Component data
	overlayTitle = 'Edit Book';
	editMode: boolean = false;
	book: Book;
	bookForm: FormGroup

	constructor(private route: ActivatedRoute, private bookService: BookService) { }
	
	ngOnInit(): void { 
		this.route.params.subscribe(
			(params: Params) => {
				let bookId = +params['id'];
				this.book = this.bookService.getBookById(bookId);
				this.editMode = params['id'] != null;
				this.initForm();
			}
		);
	}

	private initForm(): void 
	{
		this.bookForm = new FormGroup({
			'name': new FormControl(this.editMode ? this.book.name : null),
			'imagePath': new FormControl(this.editMode ? this.book.imagePath : null),
			'link': new FormControl(this.editMode ? this.book.link : null),
			'rating': new FormControl(this.editMode ? this.book.rating : null),
			'collection': new FormControl(this.editMode ? this.book.collection : null),
			'description': new FormControl(this.editMode ? this.book.description : null)
		});
	}

	onSubmit(): void {
		console.log(this.bookForm);
	}
}
