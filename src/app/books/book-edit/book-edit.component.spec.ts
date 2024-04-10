import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { BookEditComponent } from './book-edit.component';
import { routes } from 'src/app/app-routing';
import { BookService } from 'src/app/shared/services/book.service';
import { TagService } from 'src/app/shared/services/tag.service';
import { Book } from 'src/app/shared/models/book.model';
import { testData } from 'src/test-data/test-data';
import { FormArray } from '@angular/forms';

describe('BookEditComponent', () => {
	let component: BookEditComponent;
	let fixture: ComponentFixture<BookEditComponent>;
	let router: Router;
	let mockBookService: jasmine.SpyObj<BookService>;
	let mockTagService: jasmine.SpyObj<TagService>;
	let testBook: Book;

  	beforeEach(async () => {
		let mockActivatedRoute = { 
			params: { 
				subscribe: (fn: (value: any) => void) => fn({ id: 0 }) 
			}
		}
		testBook = structuredClone(testData.books[5]);
		mockBookService = jasmine.createSpyObj( 
			'BookService', {
				'getBookById': testBook,
				'updateBook': undefined,
				'addBook': undefined
			}
		);
		mockTagService = jasmine.createSpyObj('TagService', ['getAllTags', 'removeTag', 'addTag']);
		
		await TestBed.configureTestingModule({
			imports: [ BookEditComponent, RouterTestingModule.withRoutes(routes) ],
			providers: [
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				{ provide: BookService, useValue: mockBookService },
				{ provide: TagService, useValue: mockTagService }
			]
		})
    	.compileComponents();

		fixture = TestBed.createComponent(BookEditComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		fixture.detectChanges();
	});

	it('should create the book edit component', () => {
		expect(component).toBeTruthy();
	});

	it('should display book image if in edit mode', () => {
		component.editMode = true;
		component.ngAfterContentInit();
		let image = fixture.nativeElement.querySelector('img');
		expect(component.imagePreview).toEqual(testBook.imagePath);
		expect(image.src).toEqual(testBook.imagePath);
	});

	it('should display book image placeholder if in add mode', () => {
		component.editMode = false;
		component.imagePreview = 'assets/images/book-placeholder.png';
		component.ngAfterContentInit();
		fixture.detectChanges();
		let image = fixture.nativeElement.querySelector('img');
		expect(component.imagePreview).toEqual('assets/images/book-placeholder.png');
		expect(image.src).toEqual('http://localhost:9876/assets/images/book-placeholder.png');
	});

	it('should display the correct book data while in edit mode', () => {
		let name = fixture.nativeElement.querySelector('[formControlName="name"]');
		let imagePath = fixture.nativeElement.querySelector('[formControlName="imagePath"]');
		let link = fixture.nativeElement.querySelector('[formControlName="link"]');
		let rating = fixture.nativeElement.querySelector('[formControlName="rating"]');
		let collection = fixture.nativeElement.querySelector('[formControlName="collection"]');
		let description = fixture.nativeElement.querySelector('[formControlName="description"]');
		let tags = fixture.nativeElement.querySelectorAll('[formArrayName="tags"] input');

		expect(name.value).toEqual(testBook.name);
		expect(imagePath.value).toEqual(testBook.imagePath);
		expect(link.value).toEqual(testBook.link);
		expect(rating.value).toEqual(testBook.rating.toString());
		expect(collection.value).toEqual(testBook.collection);
		expect(description.value).toEqual(testBook.description);
		expect([...tags].map(tag => tag.value)).toEqual(testBook.tags);
	});

	it('should display the correct book data while in add mode', () => {
		component.editMode = false;
		component.book = null;
		component['initForm']();
		let name = fixture.nativeElement.querySelector('[formControlName="name"]');
		let imagePath = fixture.nativeElement.querySelector('[formControlName="imagePath"]');
		let link = fixture.nativeElement.querySelector('[formControlName="link"]');
		let rating = fixture.nativeElement.querySelector('[formControlName="rating"]');
		let collection = fixture.nativeElement.querySelector('[formControlName="collection"]');
		let description = fixture.nativeElement.querySelector('[formControlName="description"]');
		fixture.detectChanges();

		expect(name.value).toEqual('');
		expect(imagePath.value).toEqual('');
		expect(link.value).toEqual('');
		expect(rating.value).toEqual('');
		expect(collection.value).toEqual('');
		expect(description.value).toEqual('');
	});

	it('should add a tag form group to the form array on clicking add tag', () => {
		let tags = component.bookForm.get('tags') as FormArray;
		let tagCount = tags.length;
		let addTagButton = fixture.nativeElement.querySelector('#add-tag-button');
		addTagButton.click();
		expect(tags.length).toEqual(tagCount + 1);
	});

	it('should submit edited book after clicking save', () => {
		let saveButton = fixture.nativeElement.querySelector('#save-button');
		saveButton.click();
		expect(mockTagService.addTag).toHaveBeenCalledTimes(0);
		expect(mockTagService.removeTag).toHaveBeenCalledTimes(0);
		expect(mockBookService.updateBook).toHaveBeenCalled();
	});

	it('should submit new book after clicking save', () => {
		component.editMode = false;
		component.book = null;
		component['initForm']();
		let addTagButton = fixture.nativeElement.querySelector('#add-tag-button');
		addTagButton.click();
		let saveButton = fixture.nativeElement.querySelector('#save-button');
		saveButton.click();
		expect(mockBookService.addBook).toHaveBeenCalled();
		expect(mockTagService.addTag).toHaveBeenCalledTimes(1);
	});

	it('should remove tag form group from the form array on clicking delete tag', () => {
		let tags = component.bookForm.get('tags') as FormArray;
		let tagCount = tags.length;
		let deleteTagButton = fixture.nativeElement.querySelector('.delete-tag-button');
		deleteTagButton.click();
		expect(tags.length).toEqual(tagCount - 1);
	});

	it('should insert tag form group into the form array on clicking insert tag', () => {
		let tags = component.bookForm.get('tags') as FormArray;
		let tagCount = tags.length;
		let insertTagButton = fixture.nativeElement.querySelector('.insert-tag-button');
		insertTagButton.click();
		expect(tags.length).toEqual(tagCount + 1);
	});
});
