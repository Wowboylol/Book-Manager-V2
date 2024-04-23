import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionItemComponent } from './collection-item.component';
import { testData } from 'src/test-data/test-data';

describe('CollectionItemComponent', () => {
	let component: CollectionItemComponent;
	let fixture: ComponentFixture<CollectionItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ CollectionItemComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(CollectionItemComponent);
		component = fixture.componentInstance;
		component.collection = structuredClone(testData.collections[0]);
		fixture.detectChanges();
	});

	it('should create the collection item component', () => {
		expect(component).toBeTruthy();
	});
});
