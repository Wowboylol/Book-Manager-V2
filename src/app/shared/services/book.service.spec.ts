import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';

describe('BookService', () => {
  	let service: BookService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(BookService);
	});

	it('should create the book service', () => {
		expect(service).toBeTruthy();
	});
});
