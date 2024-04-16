import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagUsageGraphComponent } from './tag-usage-graph.component';
import { testData } from 'src/test-data/test-data';

describe('TagUsageGraphComponent', () => {
	let component: TagUsageGraphComponent;
	let fixture: ComponentFixture<TagUsageGraphComponent>;

	beforeEach(async () => {
		let mockThemeService = jasmine.createSpyObj('ThemeService', ['isDarkMode', 'themeChanged']);
		let mockTagService = jasmine.createSpyObj('TagService', {
			'getAllTags': testData.tags.slice()
		});
		let mockBookService = jasmine.createSpyObj(
			'BookService', {
				'getAllBooks': testData.books.slice(),
				'booksChanged': { subscribe: () => {} }
			}
		);

		await TestBed.configureTestingModule({
			imports: [ TagUsageGraphComponent ],
			providers: [
				{ provide: 'TagService', useValue: mockTagService },
				{ provide: 'BookService', useValue: mockBookService },
				{ provide: 'ThemeService', useValue: mockThemeService }
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(TagUsageGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the tag usage graph component', () => {
		expect(component).toBeTruthy();
	});

	it('should update the data', () => {
		component['updateData'](testData.tags.slice(0, 9));
		expect(component.topTags.length).toEqual(10);
		expect(component.topTags[0]).toEqual(testData.tags[1]);
		expect(component.topTags[1]).toEqual(testData.tags[0]);
		expect(component.topTags[2]).toEqual(testData.tags[2]);
		expect(component.topTags[9].name).toEqual('');
		expect(component.topTags[9].amount).toEqual(0);
	});

	it('should create the chart', () => {
		component.tagUsageChart.destroy();
		component['createChart']();
		expect(component.tagUsageChart).toBeTruthy();
	});

	it('should update the chart', () => {
		component.tagUsageChart.destroy();
		component['createChart']();
		spyOn(component.tagUsageChart, 'update');
		component['updateChart']();
		expect(component.tagUsageChart.update).toHaveBeenCalled();
	});

	it('should change the chart theme', () => {
		component.tagUsageChart.destroy();
		component['createChart']();
		spyOn(component.tagUsageChart, 'update');
		component['changeChartTheme'](true);
		expect(component.tagUsageChart.options.scales.x.grid.color).toEqual('rgba(255, 255, 255, 0.1)');
		expect(component.tagUsageChart.options.scales.y.grid.color).toEqual('rgba(255, 255, 255, 0.1)');
		expect(component.tagUsageChart.update).toHaveBeenCalled();
	});

	it('should unsubscribe from subscriptions on destroy', () => {
		spyOn(component['bookSubscription'], 'unsubscribe');
		spyOn(component['themeSubscription'], 'unsubscribe');
		component.ngOnDestroy();
		expect(component['bookSubscription'].unsubscribe).toHaveBeenCalled();
		expect(component['themeSubscription'].unsubscribe).toHaveBeenCalled();
	});
});
