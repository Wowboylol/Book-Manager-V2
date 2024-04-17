import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagRatingGraphComponent } from './tag-rating-graph.component';

describe('TagRatingGraphComponent', () => {
	let component: TagRatingGraphComponent;
	let fixture: ComponentFixture<TagRatingGraphComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ TagRatingGraphComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(TagRatingGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the tag rating graph component', () => {
		expect(component).toBeTruthy();
	});
});
