import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsComponent } from './collections.component';

describe('CollectionsComponent', () => {
	let component: CollectionsComponent;
	let fixture: ComponentFixture<CollectionsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ CollectionsComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(CollectionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create collection component', () => {
		expect(component).toBeTruthy();
	});

	it('should unsubscribe from collections subscription on destroy', () => {
		spyOn(component['collectionsSubscription'], 'unsubscribe');
		component.ngOnDestroy();
		expect(component['collectionsSubscription'].unsubscribe).toHaveBeenCalled();
	});
});
