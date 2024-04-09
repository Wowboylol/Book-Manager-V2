import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BookEditComponent } from './book-edit.component';
import { routes } from 'src/app/app-routing';

describe('BookEditComponent', () => {
	let component: BookEditComponent;
	let fixture: ComponentFixture<BookEditComponent>;

  	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ BookEditComponent, RouterTestingModule.withRoutes(routes) ]
		})
    	.compileComponents();

		fixture = TestBed.createComponent(BookEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the book edit component', () => {
		expect(component).toBeTruthy();
	});
});
