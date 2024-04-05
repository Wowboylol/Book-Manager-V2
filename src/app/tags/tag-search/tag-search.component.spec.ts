import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagSearchComponent } from './tag-search.component';

describe('TagSearchComponent', () => {
	let component: TagSearchComponent;
	let fixture: ComponentFixture<TagSearchComponent>;
	let searchInputElement: HTMLInputElement;
	let searchSelectElements: NodeListOf<HTMLSelectElement>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ TagSearchComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(TagSearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		// Get HTML elements
		searchInputElement = fixture.nativeElement.querySelector("input");
		searchSelectElements = fixture.nativeElement.querySelectorAll("select");
	});

	it('should create tag search component', () => {
		expect(component).toBeTruthy();
	});

	it('should emit search query with default values', () => {
		spyOn(component.searchQuery, 'emit');
		component.ngOnInit();
		expect(component.searchQuery.emit).toHaveBeenCalledWith({ searchString: "", searchSort: 0, searchOrder: 1 });
	});

	it('should emit search query with custom values', () => {
		spyOn(component.searchQuery, 'emit');
		component.searchStringRef.nativeElement.value = "tag name 123";
		component.searchSortRef.nativeElement.value = "1";
		component.searchOrderRef.nativeElement.value = "0";
		component.onSubmitSearch();
		expect(component.searchQuery.emit).toHaveBeenCalledWith({ searchString: "tag name 123", searchSort: 1, searchOrder: 0 });
	});

	it('should update search string view child when input changes', () => {
		searchInputElement.value = "tag name 123";
		searchInputElement.dispatchEvent(new Event('input'));
		expect(component.searchStringRef.nativeElement.value).toBe("tag name 123");
	});

	it('should update select view children when selection changes', () => {
		searchSelectElements[0].selectedIndex = 1;
		searchSelectElements[0].dispatchEvent(new Event('change'));
		searchSelectElements[1].selectedIndex = 0;
		searchSelectElements[1].dispatchEvent(new Event('change'));
		expect(component.searchSortRef.nativeElement.value).toBe("1");
		expect(component.searchOrderRef.nativeElement.value).toBe("0");
	});
});
