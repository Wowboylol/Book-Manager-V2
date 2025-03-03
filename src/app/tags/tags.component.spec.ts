import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Subject } from 'rxjs';
import { TagsComponent } from './tags.component';
import { routes } from 'src/app/app-routing';
import { TagSearchPipe } from '../shared/pipes/tag-search.pipe';
import { TagService } from '../shared/services/tag.service';
import { testData } from 'src/test-data/test-data';
import { BookService } from '../shared/services/book.service';
import { Tag } from '../shared/models/tag.model';

describe('TagsComponent', () => {
	let component: TagsComponent;
	let fixture: ComponentFixture<TagsComponent>;
	let mockTagService: jasmine.SpyObj<TagService>;
	let mockBookService: jasmine.SpyObj<BookService>;
	let pipeSpy: jasmine.Spy;
	let testTags: Tag[];

	beforeEach(async () => {
		mockBookService = jasmine.createSpyObj('BookService', ['updateTagInBooks', 'deleteTagFromBooks']);
		mockTagService = jasmine.createSpyObj(
			'TagService', { 
				'getAllTags': testData.tags.slice(),
				'updateTagName': undefined,
				'updateTagDescription': undefined,
				'deleteTag': undefined,
			},
			{ 'tagsChanged': new Subject<Tag[]>() }
		);
		
		await TestBed.configureTestingModule({
			imports: [ TagsComponent, RouterTestingModule.withRoutes(routes) ],
			providers: [
				{ provide: TagService, useValue: mockTagService },
				{ provide: BookService, useValue: mockBookService },
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(TagsComponent);
		component = fixture.componentInstance;
		pipeSpy = spyOn(TagSearchPipe.prototype, 'transform');
		testTags = testData.tags.slice();
		fixture.detectChanges();
  	});

	it('should create tag component', () => {
		expect(component).toBeTruthy();
	});

	it('should update tag form with selected tag data', () => {
		component.onSelectTag(testTags[0]);
		expect(component.selectedTagName).toBe(testTags[0].name);
		expect(component.tagForm.value.name).toBe(testTags[0].name);
		expect(component.tagForm.value.description).toBe(testTags[0].description);
	});

	it('should update tag name, description, and corresponding books when onUpdate is called', () => {
		let formNameInput = fixture.nativeElement.querySelector('input[name="name"]');
		let formDescriptionInput = fixture.nativeElement.querySelector('textarea[name="description"]');
		formNameInput.value = "new name";
		formNameInput.dispatchEvent(new Event('input'));
		formDescriptionInput.value = "new description";
		formDescriptionInput.dispatchEvent(new Event('input'));

		component.selectedTagName = testTags[0].name;
		component.onUpdate();
		expect(mockTagService.updateTagName).toHaveBeenCalledWith(testTags[0].name, "new name");
		expect(mockBookService.updateTagInBooks).toHaveBeenCalledWith(testTags[0].name, "new name");
		expect(mockTagService.updateTagDescription).toHaveBeenCalledWith("new name", "new description");
	});

	it('should reset form and selected tag when onDeselect is called', () => {
		component.onSelectTag(testTags[0]);
		component.onDeselect();
		expect(component.selectedTagName).toBeNull();
		expect(component.tagForm.value.name).toBeNull();
		expect(component.tagForm.value.description).toBeNull();
	});

	it('should delete tag and tags in corresponding books when onDelete is called', () => {
		component.selectedTagName = testTags[0].name;
		component.onDelete();
		expect(mockTagService.deleteTag).toHaveBeenCalledWith(testTags[0].name);
		expect(mockBookService.deleteTagFromBooks).toHaveBeenCalledWith(testTags[0].name);
	});

	it('should close confirm delete modal when onDelete is called', () => {
		component.showConfirmDelete = true;
		component.onDelete();
		expect(component.showConfirmDelete).toBeFalse();
	});

	it('should return true when checking tag name validity if selected tag name is same as input', () => {
		component.selectedTagName = "test";
		component.tagForm.setValue({ name: "test", description: null });
		expect(component.isValidTagName()).toBeTrue();
	});

	it('should return false when checking tag name validity if input is empty', () => {
		component.tagForm.setValue({ name: "", description: null });
		expect(component.isValidTagName()).toBeFalse();
	});

	it('should run TagSearchPipe when search query is updated', () => {
		component.onSearchQuery({ searchString: "test", searchSort: 0, searchOrder: 0 });
		expect(pipeSpy).toHaveBeenCalled();
	});

	it('should show alert when search query is updated and then hide alert', fakeAsync(() => {
		component.alertToggle = 'hidden';
		component.onSearchQuery({ searchString: "test", searchSort: 0, searchOrder: 0 });
		expect(component.alertToggle).toBe('show');
		tick(3000);
		expect(component.alertToggle).toBe('hidden');
	}));

	it('should display all tags if search query is default', () => {
		component.tags = testTags;
		component.onSearchQuery({ searchString: "", searchSort: 0, searchOrder: 1 });
		expect(component.searchCount.value).toBe(testTags.length);
	});

	it('should unsubscribe from tag changes on destroy', () => {
		spyOn(component['tagsChangedSubscription'], 'unsubscribe');
		component.ngOnDestroy();
		expect(component['tagsChangedSubscription'].unsubscribe).toHaveBeenCalled();
	});

	it('should show delete confirmation modal when delete button is clicked', () => {
		let deleteButton = fixture.nativeElement.querySelector('.btn-danger');
		deleteButton.click();
		expect(component.showConfirmDelete).toBeTrue();
	});

	it('should display no tag found message if no tags are found', () => {
		component.searchCount.value = 0;
		fixture.detectChanges();
		let noTagFoundMessage = fixture.nativeElement.querySelector('#no-tag-found');
		expect(noTagFoundMessage).toBeTruthy();
	});
});
