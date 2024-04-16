import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagUsageGraphComponent } from './tag-usage-graph.component';

describe('TagUsageGraphComponent', () => {
	let component: TagUsageGraphComponent;
	let fixture: ComponentFixture<TagUsageGraphComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ TagUsageGraphComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(TagUsageGraphComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the tag usage graph component', () => {
		expect(component).toBeTruthy();
	});
});
