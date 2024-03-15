import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookItemComponent } from './book-item.component';

describe('BookItemComponent', () => {
	let component: BookItemComponent;
	let fixture: ComponentFixture<BookItemComponent>;
	let titleElement: HTMLElement;
	let imageElement: HTMLMediaElement;
	let ratingElements: NodeListOf<Element>;

  	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ BookItemComponent ]
		})
    	.compileComponents();

		fixture = TestBed.createComponent(BookItemComponent);
		component = fixture.componentInstance;

		// Create mock book supplied by parent component
		component.book = {
			name: "Test Book",
            description: "Test book description",
            link: "https://www.google.com/",
            imagePath: "https://i.imgur.com/4DQmEtU.jpeg",
            rating: 3,
            dateCreated: new Date("2024-03-15"),
            dateUpdated: new Date("2024-03-12"),
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
});
