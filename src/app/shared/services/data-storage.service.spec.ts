import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { testData } from 'src/test-data/test-data';
import { DataStorageService } from './data-storage.service';
import { BookService } from './book.service';
import { TagService } from './tag.service';

describe('DataStorageService', () => {
  	let service: DataStorageService;
	let controller: HttpTestingController;
	let mockBookService: jasmine.SpyObj<BookService>;
	let mockTagService: jasmine.SpyObj<TagService>;

	beforeEach(() => {
		mockBookService = jasmine.createSpyObj('BookService', ['getAllBooks', 'setBooks']);
		mockTagService = jasmine.createSpyObj('TagService', ['getAllTags', 'setTags']);
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				DataStorageService,
				{ provide: BookService, useValue: mockBookService },
				{ provide: TagService, useValue: mockTagService }
			]
		});
		service = TestBed.inject(DataStorageService);
		controller = TestBed.inject(HttpTestingController);
	});

	it('stores data to database', () => {
		spyOn(service, 'storeData').and.callThrough();
		service.storeData();
		expect(service.storeData).toHaveBeenCalled();
		expect(mockBookService.getAllBooks).toHaveBeenCalled();
		expect(mockTagService.getAllTags).toHaveBeenCalled();
	})

	it('fetches data from database and returns empty book & tag array when response is empty', () => {
		service.fetchData();
		const request = controller.expectOne(`${environment.firebaseEndpoint}data.json`);
		request.flush({ });
		expect(mockTagService.setTags).toHaveBeenCalledWith([]);
		expect(mockBookService.setBooks).toHaveBeenCalledWith([]);
	});

	it('fetches data from database and returns empty tag array when only books exist', () => {
		let testBooks = structuredClone(testData.books);
		service.fetchData();
		const request = controller.expectOne(`${environment.firebaseEndpoint}data.json`);
		request.flush({ books: testBooks });
		expect(mockTagService.setTags).toHaveBeenCalledWith([]);
		expect(mockBookService.setBooks).toHaveBeenCalledWith(testBooks);
	});

	it('fetches data from database and returns book & tag data when data exists', () => {
		let testBook = structuredClone(testData.books[2]);
		testBook.dateCreated = undefined;
		testBook.dateUpdated = undefined;
		testBook.tags = undefined;
		
		let testTag = structuredClone(testData.tags[2]);
		testTag.description = undefined;

		service.fetchData();
		const request = controller.expectOne(`${environment.firebaseEndpoint}data.json`);
		request.flush({ books: [testBook], tags: [testTag] });

		testBook.dateCreated = null;
		testBook.dateUpdated = null;
		testBook.tags = [];

		testTag.description = null;

		expect(mockTagService.setTags).toHaveBeenCalledWith([testTag]);
		expect(mockBookService.setBooks).toHaveBeenCalledWith([testBook]);
	});
});
