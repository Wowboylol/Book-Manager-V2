import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BookDetailComponent } from './book-detail.component';
import { BookService } from 'src/app/shared/services/book.service';
import { TagService } from 'src/app/shared/services/tag.service';
import { Book } from 'src/app/shared/models/book.model';

describe('BookDetailComponent', () => {
	let fixture: ComponentFixture<BookDetailComponent>;
	let component: BookDetailComponent;
	let mockBookService: jasmine.SpyObj<BookService>;
	let mockTagService: jasmine.SpyObj<TagService>;
	let testBook: Book = {
		id: 0,
		name: "Test Book",
		description: "Test book description",
		link: "https://www.google.com/",
		imagePath: "https://i.imgur.com/4DQmEtU.jpeg",
		rating: 3,
		dateCreated: new Date("Mar 10, 2024"),
		dateUpdated: new Date("Mar 12, 2024"),
		tags: ["tag0", "tag1", "tag2", "tag3"],
		collection: "myBookCollection"
	}

  	beforeEach(() => {
		let mockActivatedRoute = {
			params: {
				subscribe: (fn: (value: any) => void) => fn({
					id: 0
				})
			}
		}
		mockBookService = jasmine.createSpyObj('BookService', ['getBookById']);
		mockTagService = jasmine.createSpyObj(
			'TagService', { 
				'getTagByName': { name: "test", amount: 1, lastUsed: new Date() }
			}
		);
		
		TestBed.configureTestingModule({
			imports: [ BookDetailComponent ],
			providers: [
				{ provide: BookService, useValue: mockBookService },
				{ provide: ActivatedRoute, useValue: mockActivatedRoute },
				{ provide: TagService, useValue: mockTagService }
			]
		})

		fixture = TestBed.createComponent(BookDetailComponent);
		component = fixture.componentInstance;
  	});

	it('should create book detail component', () => {
		expect(component).toBeTruthy();
	});

	it('should display book name', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let nameElement = fixture.nativeElement.querySelector("#name");
		expect(nameElement.textContent).toContain(testBook.name);
	});

	it('should display book link', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let linkElement = fixture.nativeElement.querySelector("#link");
		expect(linkElement.textContent).toContain(testBook.link);
	});

	it('should display book description', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let descriptionElement = fixture.nativeElement.querySelector("#description");
		expect(descriptionElement.textContent).toContain(testBook.description);
	});

	it('should display book image when imagePath not null', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let imageElement = fixture.nativeElement.querySelector("#image");
		expect(imageElement.src).toContain(testBook.imagePath);
	});

	it('should display placeholder book image when imagePath is null', () => {
		let originalImagePath = testBook.imagePath;
		testBook.imagePath = null;
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		testBook.imagePath = originalImagePath;
		let imageElement = fixture.nativeElement.querySelector("#image");
		expect(imageElement.src).toContain("assets/images/book-placeholder.png");
	});

	it('should display correct book rating', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let ratingElements = fixture.nativeElement.querySelectorAll("i");
		let rating = 0;
		for (let i = 0; i < ratingElements.length; i++) {
			if (ratingElements[i].classList.contains("checked")) {
				rating++;
			}
		}
		expect(rating).toBe(component.book.rating);
	});

	it('should display book collection', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let collectionElement = fixture.nativeElement.querySelector("#collection");
		expect(collectionElement.textContent).toContain(testBook.collection);
	});

	it('should display correct amount of tags', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let tagElements = fixture.nativeElement.querySelectorAll(".book-tag");
		expect(tagElements.length).toBe(testBook.tags.length);
	});

	it('tag display should display None when book has no tags', () => {
		testBook.tags = [];
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let noTagMessageElement = fixture.nativeElement.querySelectorAll("#no-tags");
		expect(noTagMessageElement.length).toBe(1);
	});

	it('should display book creation date with date pipe', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let dateElement = fixture.nativeElement.querySelector("#dateCreated");
		expect(dateElement.textContent).toContain("Mar 10, 2024");
	});

	it('should display N/A for book creation date when dateCreated is null', () => {
		let originalDateCreated = testBook.dateCreated;
		testBook.dateCreated = null;
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		testBook.dateCreated = originalDateCreated;
		let dateElement = fixture.nativeElement.querySelector("#dateCreated");
		expect(dateElement.textContent).toBe("N/A");
	});

	it('should display book update date with date pipe', () => {
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		let dateElement = fixture.nativeElement.querySelector("#dateUpdated");
		expect(dateElement.textContent).toContain("Mar 12, 2024");
	});

	it('should display N/A for book update date when dateUpdated is null', () => {
		let originalDateUpdated = testBook.dateUpdated;
		testBook.dateUpdated = null;
		mockBookService.getBookById.and.returnValue(testBook);
		fixture.detectChanges();
		testBook.dateUpdated = originalDateUpdated;
		let dateElement = fixture.nativeElement.querySelector("#dateUpdated");
		expect(dateElement.textContent).toBe("N/A");
	});
});
