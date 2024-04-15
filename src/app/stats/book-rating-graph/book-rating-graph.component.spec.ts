import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRatingGraphComponent } from './book-rating-graph.component';

describe('BookRatingGraphComponent', () => {
	let component: BookRatingGraphComponent;
	let fixture: ComponentFixture<BookRatingGraphComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ BookRatingGraphComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(BookRatingGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the book rating graph', () => {
		expect(component).toBeTruthy();
	});
});
