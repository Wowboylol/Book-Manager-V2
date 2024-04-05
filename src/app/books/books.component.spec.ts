import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BooksComponent } from './books.component';
import { routes } from 'src/app/app-routing';
import { BookSearchPipe } from '../shared/pipes/book-search.pipe';

describe('BooksComponent', () => {
	let component: BooksComponent;
	let fixture: ComponentFixture<BooksComponent>;
	let pipeSpy: jasmine.Spy;

  	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ BooksComponent, RouterTestingModule.withRoutes(routes) ],
		})
		.compileComponents();

		fixture = TestBed.createComponent(BooksComponent);
		component = fixture.componentInstance;
		pipeSpy = spyOn(BookSearchPipe.prototype, 'transform');
		fixture.detectChanges();
	});

	it('should create book component', () => {
		expect(component).toBeTruthy();
	});

	it('should display load more button if books are over limit', () => {
		component.bookDisplayLimit = component.books.length - 1;
		fixture.detectChanges();
		let loadMoreButton = fixture.nativeElement.querySelector(".load-button");
		expect(loadMoreButton).toBeTruthy();
	});

	it('should not display load more button if books are not over limit', () => {
		component.bookDisplayLimit = component.books.length;
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

	it('should run BookSearchPipe when search query is updated', () => {
		component.onSearchQuery({ searchString: "test", searchType: 0, searchSort: 0, searchOrder: 0 });
		expect(pipeSpy).toHaveBeenCalled();
	});

	it('should display all books if search query is default', () => {
		let initialBookCount = component.books.length;
		component.onSearchQuery({ searchString: "", searchType: 0, searchSort: 0, searchOrder: 0 });
		expect(component.searchCount.value).toBe(initialBookCount);
	});

	it('should display alert when search query is updated and then hide alert', 
		fakeAsync(() => {
			component.onSearchQuery({ searchString: "test", searchType: 0, searchSort: 0, searchOrder: 0 });
			expect(component.alertToggle).toBe('show');
			tick(3000);
			expect(component.alertToggle).toBe('hidden');
		}
	));

	it('should change display type when style button is clicked', 
		fakeAsync(() => {
			spyOn<BooksComponent, any>(component, 'changeDisplayType');
			let styleButton = fixture.nativeElement.querySelector(".change-type-button");
			styleButton.click();
			tick();
			expect(component.changeDisplayType).toHaveBeenCalled();
		}
	));

	it('should unsubscribe from book changes when component is destroyed', () => {
		spyOn(component['booksChangedSubscription'], 'unsubscribe');
		component.ngOnDestroy();
		expect(component['booksChangedSubscription'].unsubscribe).toHaveBeenCalled();
	});
});
