import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { BookSearchComponent } from './book-search.component';
import { routes } from 'src/app/app-routing';

describe('BookSearchComponent', () => {
    let component: BookSearchComponent;
    let fixture: ComponentFixture<BookSearchComponent>;
    let searchInputElement: HTMLInputElement;
    let searchSelectElements: NodeListOf<HTMLSelectElement>;
    let mockActivatedRoute;

    beforeEach(async () => {
        mockActivatedRoute = {
            snapshot: {
                queryParams: {
                    searchString: "search test collection",
                    searchType: "2",
                    searchSort: "0",
                    searchOrder: "0"
                }
            }
		}

        await TestBed.configureTestingModule({
            imports: [ BookSearchComponent, RouterTestingModule.withRoutes(routes) ],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        })
        .compileComponents();

        fixture = TestBed.createComponent(BookSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // Get HTML elements
        searchInputElement = fixture.nativeElement.querySelector("input");
        searchSelectElements = fixture.nativeElement.querySelectorAll("select");
    });

    it('should create book search component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit search query with default values when there are no query params', () => {
        mockActivatedRoute.snapshot.queryParams = {};
        spyOn(component.searchQuery, 'emit');
        component.ngOnInit();
        expect(component.searchQuery.emit).toHaveBeenCalledWith({ searchString: "", searchType: 0, searchSort: 0, searchOrder: 0 });
    });

    it('should emit search query with query params values', () => {
        spyOn(component.searchQuery, 'emit');
        component.ngOnInit();
        expect(component.searchQuery.emit).toHaveBeenCalledWith({ searchString: "search test collection", searchType: 2, searchSort: 0, searchOrder: 0 });
    });

    it('should emit search query with custom values', () => {
        spyOn(component.searchQuery, 'emit');
        component.searchStringRef.nativeElement.value = "search";
        component.searchTypeRef.nativeElement.value = "2";
        component.searchSortRef.nativeElement.value = "3";
        component.searchOrderRef.nativeElement.value = "1";
        component.onSubmitSearch();
        expect(component.searchQuery.emit).toHaveBeenCalledWith({ searchString: "search", searchType: 2, searchSort: 3, searchOrder: 1 });
    });

    it('should update search element references with query params values', () => {
        expect(component.searchStringRef.nativeElement.value).toBe("search test collection");
        expect(component.searchTypeRef.nativeElement.value).toBe("2");
        expect(component.searchSortRef.nativeElement.value).toBe("0");
        expect(component.searchOrderRef.nativeElement.value).toBe("0");
    });

    it('should update search string view child when input changes', () => {
        searchInputElement.value = "search";
        searchInputElement.dispatchEvent(new Event('input'));
        expect(component.searchStringRef.nativeElement.value).toBe("search");
    });

    it('should update select view children when selection changes', () => {
        searchSelectElements[0].selectedIndex = 2;
        searchSelectElements[0].dispatchEvent(new Event('change'));
        searchSelectElements[1].selectedIndex = 3;
        searchSelectElements[1].dispatchEvent(new Event('change'));
        searchSelectElements[2].selectedIndex = 1;
        searchSelectElements[2].dispatchEvent(new Event('change'));
        expect(component.searchTypeRef.nativeElement.value).toBe("2");
        expect(component.searchSortRef.nativeElement.value).toBe("3");
        expect(component.searchOrderRef.nativeElement.value).toBe("1");
    });
});
