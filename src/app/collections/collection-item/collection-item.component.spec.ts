import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CollectionItemComponent } from './collection-item.component';
import { testData } from 'src/test-data/test-data';
import { routes } from 'src/app/app-routing';
import { CollectionService } from 'src/app/shared/services/collection.service';
import { BookService } from 'src/app/shared/services/book.service';

describe('CollectionItemComponent', () => {
	let component: CollectionItemComponent;
	let fixture: ComponentFixture<CollectionItemComponent>;
	let mockCollectionService: jasmine.SpyObj<CollectionService>;
	let mockBookService: jasmine.SpyObj<BookService>;

	beforeEach(async () => {
		mockCollectionService = jasmine.createSpyObj('CollectionService', [
			'deleteCollection', 'updateCollectionColor', 'updateCollectionName', 'collectionExists'
		]);
		mockBookService = jasmine.createSpyObj('BookService', {
			'getBooksByCollection': testData.books,
			'deleteCollectionFromBooks': undefined,
			'updateCollectionInBooks': undefined
		});

		await TestBed.configureTestingModule({
			imports: [ CollectionItemComponent, RouterTestingModule.withRoutes(routes) ],
			providers: [
				{ provide: CollectionService, useValue: mockCollectionService },
				{ provide: BookService, useValue: mockBookService }
			]
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

	it('should get the collection image', () => {		
		mockBookService.getBooksByCollection.and.returnValue([structuredClone(testData.books[0])]);
		expect(component.getCollectionImage()).toBe(`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${testData.books[0].imagePath})`);
	});

	it('should get empty collection image if there are no books in the collection', () => {
		mockBookService.getBooksByCollection.and.returnValue([]);
		expect(component.getCollectionImage()).toBe(`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url()`);
	});

	it('should get the collection color', () => {
		expect(component.getCollectionColor()).toBe(testData.collections[0].color);
	});

	it('should update the collection color on color input blur', () => {
		let colorInputEl = fixture.nativeElement.querySelector('input[type="color"]');
		colorInputEl.value = '#ffffff';
		colorInputEl.dispatchEvent(new Event('input'));
		colorInputEl.dispatchEvent(new Event('blur'));
		expect(mockCollectionService.updateCollectionColor).toHaveBeenCalledWith(component.collection.name, '#ffffff');
	});

	it('should delete the collection', () => {
		component.onDeleteCollection();
		expect(mockBookService.deleteCollectionFromBooks).toHaveBeenCalledWith(component.collection.name);
		expect(mockCollectionService.deleteCollection).toHaveBeenCalledWith(component.collection.name);
	});

	it('should update the collection name on name input blur and name is valid', () => {
		mockCollectionService.collectionExists.and.returnValue(false);
		component.editMode = true;
		fixture.detectChanges();

		let nameInputEl = fixture.nativeElement.querySelector('input[type="text"]');
		nameInputEl.value = 'new name';
		nameInputEl.dispatchEvent(new Event('input'));
		nameInputEl.dispatchEvent(new Event('blur'));

		expect(mockBookService.updateCollectionInBooks).toHaveBeenCalledWith(component.collection.name, 'new name');
		expect(mockCollectionService.updateCollectionName).toHaveBeenCalledWith(component.collection.name, 'new name');
		expect(component.collectionSearchQuery.searchString).toBe('new name');
		expect(component.editMode).toBeFalse();
	});

	it('should update the collection name on key up enter and name is valid', () => {
		mockCollectionService.collectionExists.and.returnValue(false);
		component.editMode = true;
		fixture.detectChanges();

		let nameInputEl = fixture.nativeElement.querySelector('input[type="text"]');
		nameInputEl.value = 'new name';
		nameInputEl.dispatchEvent(new Event('input'));
		nameInputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

		expect(mockBookService.updateCollectionInBooks).toHaveBeenCalledWith(component.collection.name, 'new name');
		expect(mockCollectionService.updateCollectionName).toHaveBeenCalledWith(component.collection.name, 'new name');
		expect(component.collectionSearchQuery.searchString).toBe('new name');
		expect(component.editMode).toBeFalse();
	});

	it('should not update the collection name if the name is invalid', () => {
		mockCollectionService.collectionExists.and.returnValue(true);
		component.editMode = true;
		fixture.detectChanges();

		let nameInputEl = fixture.nativeElement.querySelector('input[type="text"]');
		nameInputEl.value = '';
		nameInputEl.dispatchEvent(new Event('input'));
		nameInputEl.dispatchEvent(new Event('blur'));

		expect(mockBookService.updateCollectionInBooks).not.toHaveBeenCalled();
		expect(mockCollectionService.updateCollectionName).not.toHaveBeenCalled();
		expect(component.collectionSearchQuery.searchString).toBe(component.collection.name);
		expect(component.editMode).toBeTrue();
	});
});
