import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BookItemComponent } from './book-item.component';
import { routes } from 'src/app/app-routing';
import { TagService } from 'src/app/shared/services/tag.service';

describe('BookItemComponent', () => {
	let component: BookItemComponent;
	let fixture: ComponentFixture<BookItemComponent>;
	let titleElement: HTMLElement;
	let imageElement: HTMLMediaElement;
	let ratingElements: NodeListOf<Element>;
	let mockTagService: jasmine.SpyObj<TagService>;

  	beforeEach(async () => {
		mockTagService = jasmine.createSpyObj(
			'TagService', { 
				'getTagByName': { name: "test", amount: 1, description: "test" }
			}
		);

		await TestBed.configureTestingModule({
			imports: [ BookItemComponent, RouterTestingModule.withRoutes(routes) ],
			providers: [
				{ provide: TagService, useValue: mockTagService }
			]
		})
    	.compileComponents();

		fixture = TestBed.createComponent(BookItemComponent);
		component = fixture.componentInstance;

		// Create mock book supplied by parent component
		component.book = {
			id: 0,
			name: "Test Book",
            description: "Test book description",
            link: "https://www.google.com/",
            imagePath: "https://i.imgur.com/4DQmEtU.jpeg",
            rating: 3,
            dateCreated: new Date("Mar 10, 2024"),
			dateUpdated: new Date("Mar 12, 2024"),
            tags: ["tag0", "tag1", "tag2", "tag3"],
            "collection": "myBookCollection"
		}

		fixture.detectChanges();

		// Get HTML elements
		titleElement = fixture.nativeElement.querySelector("p");
		imageElement = fixture.nativeElement.querySelector("img");
		ratingElements = fixture.nativeElement.querySelectorAll("i");
 	});

	it('should create the book item', () => {
		expect(component).toBeTruthy();
	});

	it('should display the book title', () => {
		expect(titleElement.textContent).toContain(component.book.name);
	});

	it('should display the book image', () => {
		expect(imageElement.src).toContain(component.book.imagePath);
	});

	it('should display the correct book rating', () => {
		let rating = 0;
		for (let i = 0; i < ratingElements.length; i++) {
			if (ratingElements[i].classList.contains("checked")) {
				rating++;
			}
		}
		expect(rating).toBe(component.book.rating);
	});

	it('should display correct amount of tags when displayStyle is list', () => {
		component.displayStyle = 1;
		fixture.detectChanges();
		let tags = fixture.nativeElement.querySelectorAll(".book-tag");
		expect(tags.length).toBe(component.book.tags.length);
	});

	it('should create new resize observable and call fill gap when image is loaded', () => {
		let imageElement = fixture.nativeElement.querySelector("img");
		spyOn(component.resizeObserver, 'observe');
		spyOn<any>(component, 'fillImageGap');
		imageElement.dispatchEvent(new Event('load'));
		expect(component.resizeObserver.observe).toHaveBeenCalled();
		expect(component['fillImageGap']).toHaveBeenCalled();
	});

	it('should unsubscribe from resize observer on destroy', () => {
		spyOn(component.resizeObserver, 'disconnect');
		component.ngOnDestroy();
		expect(component.resizeObserver.disconnect).toHaveBeenCalled();
	});

	it('should fill image gap when image is smaller than image container and display style is grid', () => {
		let testImageHeight = 50;
		component.detailsContainer.nativeElement.style.marginTop = '0px';
		component.displayStyle = 0;
		fixture.detectChanges();
		component.imageContainer.nativeElement.style.height = '100px';
		component['fillImageGap'](testImageHeight);
		expect(component.detailsContainer.nativeElement.style.marginTop).toBe(`-${100 - testImageHeight}px`);
	});

	it('should not fill image gap when image is bigger than image container and display style is grod', () => {
		let testImageHeight = 110;
		component.detailsContainer.nativeElement.style.marginTop = '0px';
		component.displayStyle = 0;
		fixture.detectChanges();
		component.imageContainer.nativeElement.style.height = '100px';
		component['fillImageGap'](testImageHeight);
		expect(component.detailsContainer.nativeElement.style.marginTop).toBe('0px');
	});

	it('should set image gap to 0px when display style is list', () => {
		let testImageHeight = 50;
		component.detailsContainer.nativeElement.style.marginTop = '50px';
		component.displayStyle = 1;
		fixture.detectChanges();
		component.imageContainer.nativeElement.style.height = '100px';
		component['fillImageGap'](testImageHeight);
		expect(component.detailsContainer.nativeElement.style.marginTop).toBe('0px');
	});
});
