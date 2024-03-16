import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksComponent } from './books.component';

describe('BooksComponent', () => {
	let component: BooksComponent;
	let fixture: ComponentFixture<BooksComponent>;
	let bookItems: NodeListOf<Element>;

  	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ BooksComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(BooksComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		// Get HTML elements
		bookItems = fixture.nativeElement.querySelectorAll("app-book-item");
	});

	it('should create book component', () => {
		expect(component).toBeTruthy();
	});

	it('should have same amount of book items as stored books', () => {
		expect(bookItems.length).toBe(component.books.length);
	});
});
