import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRatingGraphComponent } from './book-rating-graph.component';
import { testData } from 'src/test-data/test-data';

describe('BookRatingGraphComponent', () => {
	let component: BookRatingGraphComponent;
	let fixture: ComponentFixture<BookRatingGraphComponent>;

	beforeEach(async () => {
		let mockThemeService = jasmine.createSpyObj('ThemeService', ['isDarkMode', 'themeChanged']);
		let mockBookService = jasmine.createSpyObj(
			'BookService', {
				'getAllBooks': testData.books.slice(),
				'booksChanged': { subscribe: () => {} }
			}
		);

		await TestBed.configureTestingModule({
			imports: [ BookRatingGraphComponent ],
			providers: [
				{ provide: 'BookService', useValue: mockBookService },
				{ provide: 'ThemeService', useValue: mockThemeService }
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(BookRatingGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the book rating graph component', () => {
		expect(component).toBeTruthy();
	});

	it('should update the data', () => {
		component['updateData'](testData.books.slice());
		expect(component.totalBooks).toEqual(testData.books.length);
		expect(component.averageRating).toEqual(2.83);
		expect(component.starRatings).toEqual([1, 0, 2, 0, 2, 1]);
	});

	it('should create the chart', () => {
		component.bookRatingChart.destroy();
		component['createChart']();
		expect(component.bookRatingChart).toBeTruthy();
	});

	it('should update the chart', () => {
		component.bookRatingChart.destroy();
		component['createChart']();
		spyOn(component.bookRatingChart, 'update');
		component['updateChart']();
		expect(component.bookRatingChart.update).toHaveBeenCalled();
	});

	it('should change the chart theme', () => {
		component.bookRatingChart.destroy();
		component['createChart']();
		spyOn(component.bookRatingChart, 'update');
		component['changeChartTheme'](true);
		expect(component.bookRatingChart.options.scales.x.grid.color).toEqual('rgba(255, 255, 255, 0.1)');
		expect(component.bookRatingChart.options.scales.y.grid.color).toEqual('rgba(255, 255, 255, 0.1)');
		expect(component.bookRatingChart.update).toHaveBeenCalled();
	});

	it('should unsubscribe from subscriptions on destroy', () => {
		spyOn(component['bookSubscription'], 'unsubscribe');
		spyOn(component['themeSubscription'], 'unsubscribe');
		component.ngOnDestroy();
		expect(component['bookSubscription'].unsubscribe).toHaveBeenCalled();
		expect(component['themeSubscription'].unsubscribe).toHaveBeenCalled();
	});
});
