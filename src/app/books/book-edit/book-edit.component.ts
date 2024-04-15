import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Book } from 'src/app/shared/models/book.model';
import { BookService } from '../../shared/services/book.service';
import { TagService } from '../../shared/services/tag.service';
import { Tag } from 'src/app/shared/models/tag.model';
import { CollectionService } from 'src/app/shared/services/collection.service';
import { Collection } from 'src/app/shared/models/collection.model';

@Component({
	selector: 'app-book-edit',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, RouterModule],
	templateUrl: './book-edit.component.html',
	styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit, AfterContentInit 
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
	imagePreview: string = 'assets/images/book-placeholder.png';

	constructor(
		private route: ActivatedRoute, 
		private bookService: BookService, 
		private tagService: TagService, 
		private router: Router, 
		private collectionService: CollectionService
	) { }
	
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

	ngAfterContentInit(): void {
		this.imagePreview = this.editMode ? this.book.imagePath : this.imagePreview;
	}

	get tagControls() {
		return (<FormArray>this.bookForm.get('tags')).controls;
	}

	get allTags(): Tag[] {
		return this.tagService.getAllTags();
	}

	get allCollections(): Collection[] {
		return this.collectionService.getAllCollections();
	}

	onAddTag(): void {
		(<FormArray>this.bookForm.get('tags')).push(
			new FormGroup({ 'name': new FormControl(null, Validators.required) })
		);
	}

	onSubmit(): void {
		// Create a new book object with info that must exist for both adding and updating a book
		const newBook = new Book(
			-1,
			this.bookForm.value['name'],
			this.bookForm.value['description'],
			this.bookForm.value['link'],
			this.bookForm.value['imagePath'],
			this.bookForm.value['rating'],
			null, null,
			this.bookForm.value['tags'].map(tag => tag['name']),
			this.bookForm.value['collection']
		)

		if(this.editMode) {
			// Copy the ID and date created from the old book since we are updating it
			newBook.id = this.book.id;
			newBook.dateCreated = this.book.dateCreated;

			// Update the book and tags
			this.book.tags.filter(tag => !newBook.tags.includes(tag)).forEach(tag => this.tagService.removeTag(tag));
			newBook.tags.filter(tag => !this.book.tags.includes(tag)).forEach(tag => this.tagService.addTag(tag));
			this.bookService.updateBook(newBook);

			// Update the collection
			this.collectionService.removeCollection(this.book.collection);
			if(newBook.collection && newBook.collection !== 'None') {
				this.collectionService.addCollection(newBook.collection);
			}
		}
		else {
			// Add the book and tags
			newBook.tags.forEach(tag => this.tagService.addTag(tag));
			this.bookService.addBook(newBook);

			// Add collection if it isn't null or 'None'
			if(newBook.collection && newBook.collection !== 'None') {
				this.collectionService.addCollection(newBook.collection);
			}
		}
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	onDeleteTag(index: number): void {
		(<FormArray>this.bookForm.get('tags')).removeAt(index);
	}

	onInsertTag(index: number): void {
		(<FormArray>this.bookForm.get('tags')).insert(
			index, 
			new FormGroup({ 'name': new FormControl(null, Validators.required) })
		);
	}

	private initForm(): void {
		let tagFormArray = new FormArray([]);

		if (this.editMode && this.book.tags) {
			for (let tag of this.book.tags) {
				tagFormArray.push(
					new FormGroup({ 'name': new FormControl(tag, Validators.required) })
				);
			}
		}

		this.bookForm = new FormGroup({
			'name': new FormControl(
				this.editMode ? this.book.name : null,
				Validators.required
			),
			'imagePath': new FormControl(
				this.editMode ? this.book.imagePath : null,
				Validators.required
			),
			'link': new FormControl(
				this.editMode ? this.book.link : null,
				Validators.required
			),
			'rating': new FormControl(
				this.editMode ? this.book.rating : null,
				[Validators.required, Validators.min(0), Validators.max(5)]
			),
			'collection': new FormControl(
				this.editMode ? this.book.collection : null
			),
			'description': new FormControl(
				this.editMode ? this.book.description : null,
				Validators.required
			),
			'tags': tagFormArray
		});
	}
}
