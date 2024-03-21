import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BooksComponent } from './books.component';
import { routes } from 'src/app/app-routing';

describe('BooksComponent', () => {
	let component: BooksComponent;
	let fixture: ComponentFixture<BooksComponent>;
	let bookItems: NodeListOf<Element>;

  	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ BooksComponent, RouterTestingModule.withRoutes(routes) ]
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

	it('should display load more button if books are over limit', () => {
		component.bookDisplayLimit = component["_books"].length - 1;
		fixture.detectChanges();
		let loadMoreButton = fixture.nativeElement.querySelector(".load-button");
		expect(loadMoreButton).toBeTruthy();
	});

	it('should not display load more button if books are not over limit', () => {
		component.bookDisplayLimit = component["_books"].length;
		fixture.detectChanges();
		let loadMoreButton = fixture.nativeElement.querySelector(".load-button");
		expect(loadMoreButton).toBeNull();
	});

	it('should increase book display limit when load more button is clicked', () => {
		let initialLimit = component.bookDisplayLimit;
		let loadMoreButton = fixture.nativeElement.querySelector(".load-button");
		loadMoreButton.click();
		expect(component.bookDisplayLimit).toBeGreaterThan(initialLimit);
	});
});
