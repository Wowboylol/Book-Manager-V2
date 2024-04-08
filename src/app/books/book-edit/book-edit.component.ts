import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
	// Overlay data
	overlayResolve: (value?: string | PromiseLike<string>) => void;
	overlayTitle = new Promise<string>((resolve, reject) => {
		this.overlayResolve = resolve;
	});
	
	// Component data
	editMode: boolean = false;
	book: Book;
	bookForm: FormGroup

	constructor(private route: ActivatedRoute, private bookService: BookService) { }
	
	ngOnInit(): void { 
		this.route.params.subscribe(
			(params: Params) => {
				this.editMode = params['id'] != null;
				this.book = this.editMode ? this.bookService.getBookById(+params['id']) : null;
				this.overlayResolve(this.editMode ? 'Edit Book' : 'Add Book');
				this.initForm();
			}
		);
	}

	get tagControls(): FormArray {
		return (<FormArray>this.bookForm.get('tags')).value;
	}

	private initForm(): void 
	{
		let tagFormArray = new FormArray([]);

		if (this.editMode && this.book.tags) {
			for (let tag of this.book.tags) {
				tagFormArray.push(
					new FormGroup({ 'name': new FormControl(tag) })
				);
			}
		}

		this.bookForm = new FormGroup({
			'name': new FormControl(this.editMode ? this.book.name : null),
			'imagePath': new FormControl(this.editMode ? this.book.imagePath : null),
			'link': new FormControl(this.editMode ? this.book.link : null),
			'rating': new FormControl(this.editMode ? this.book.rating : null),
			'collection': new FormControl(this.editMode ? this.book.collection : null),
			'description': new FormControl(this.editMode ? this.book.description : null),
			'tags': tagFormArray
		});
	}

	onSubmit(): void {
		console.log(this.bookForm);
	}
}
