import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagRatingGraphComponent } from './tag-rating-graph.component';
import { testData } from 'src/test-data/test-data';

describe('TagRatingGraphComponent', () => {
	let component: TagRatingGraphComponent;
	let fixture: ComponentFixture<TagRatingGraphComponent>;

	beforeEach(async () => {
		let mockThemeService = jasmine.createSpyObj('ThemeService', ['isDarkMode', 'themeChanged']);
		let mockTagService = jasmine.createSpyObj('TagService', {
			'getAllTags': testData.tags.slice(),
			'tagExists': true
		});
		let mockBookService = jasmine.createSpyObj(
			'BookService', {
				'getAllBooks': testData.books.slice(),
				'getBooksByTag': testData.books.slice(),
				'booksChanged': { subscribe: () => {} }
			}
		);

		await TestBed.configureTestingModule({
			imports: [ TagRatingGraphComponent ],
			providers: [
				{ provide: 'TagService', useValue: mockTagService },
				{ provide: 'BookService', useValue: mockBookService },
				{ provide: 'ThemeService', useValue: mockThemeService }
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(TagRatingGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the tag rating graph component', () => {
		expect(component).toBeTruthy();
	});

	it('should update the data', () => {
		component.chosenTag = 'book';
		component['updateData']([testData.books[0], testData.books[1], testData.books[2], testData.books[4]]);
		expect(component.totalTagged).toEqual(4);
		expect(component.starRatings).toEqual([1, 0, 2, 0, 1, 0]);
		expect(component.averageRating).toEqual(2);
	});

	it('should update data to default when booksWithTags is empty', () => {
		component.chosenTag = 'book';
		component['updateData']([]);
		expect(component.totalTagged).toEqual(0);
		expect(component.starRatings).toEqual([0, 0, 0, 0, 0, 0]);
		expect(component.averageRating).toEqual(0);
		expect(component.tagValue).toEqual(0);
	});

	it('should create the chart', () => {
		component.tagRatingChart.destroy();
		component['createChart']();
		expect(component.tagRatingChart).toBeTruthy();
	});

	it('should update the chart', () => {
		component.tagRatingChart.destroy();
		component.chosenTag = 'test';
		component['createChart']();
		spyOn(component.tagRatingChart, 'update');
		component['updateChart']();
		expect(component.tagRatingChart.update).toHaveBeenCalled();
		expect(component.tagRatingChart.options.plugins.title.text).toEqual('Number of Books by Rating With Tag "test"');
	});

	it('should change the chart theme', () => {
		component.tagRatingChart.destroy();
		component['createChart']();
		spyOn(component.tagRatingChart, 'update');
		component['changeChartTheme'](true);
		expect(component.tagRatingChart.options.scales.x.grid.color).toEqual('rgba(255, 255, 255, 0.1)');
		expect(component.tagRatingChart.options.scales.y.grid.color).toEqual('rgba(255, 255, 255, 0.1)');
		expect(component.tagRatingChart.update).toHaveBeenCalled();
	});

	it('should update data and chart when query is valid and "View" button is clicked', () => {
		component.validQuery = true;
		spyOn<any>(component, 'updateData');
		spyOn<any>(component, 'updateChart');
		fixture.detectChanges();

		let submitButton = fixture.nativeElement.querySelector('button');
		submitButton.click();
		expect(component['updateData']).toHaveBeenCalled();
		expect(component['updateChart']).toHaveBeenCalled();
		expect(component.isDisplayingQuery).toBeTrue();
	});

	it('should not update data and chart when query is invalid and "View" button is clicked', () => {
		component.validQuery = false;
		spyOn<any>(component, 'updateData');
		spyOn<any>(component, 'updateChart');
		fixture.detectChanges();

		let submitButton = fixture.nativeElement.querySelector('button');
		submitButton.click();
		expect(component['updateData']).not.toHaveBeenCalled();
		expect(component['updateChart']).not.toHaveBeenCalled();
		expect(component.isDisplayingQuery).toBeFalse();
	});

	it('should destroy chart and unsubscribe from subscriptions on destroy', () => {
		spyOn(component.tagRatingChart, 'destroy');
		spyOn(component['bookSubscription'], 'unsubscribe');
		spyOn(component['themeSubscription'], 'unsubscribe');
		component.ngOnDestroy();
		expect(component.tagRatingChart.destroy).toHaveBeenCalled();
		expect(component['bookSubscription'].unsubscribe).toHaveBeenCalled();
		expect(component['themeSubscription'].unsubscribe).toHaveBeenCalled();
	});
});
