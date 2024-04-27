import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { testData } from 'src/test-data/test-data';
import { DataStorageService } from './data-storage.service';
import { BookService } from './book.service';
import { TagService } from './tag.service';
import { CollectionService } from './collection.service';
import { User } from '../models/user.model';

describe('DataStorageService', () => {
  	let service: DataStorageService;
	let controller: HttpTestingController;
	let mockBookService: jasmine.SpyObj<BookService>;
	let mockTagService: jasmine.SpyObj<TagService>;
	let mockCollectionService: jasmine.SpyObj<CollectionService>;

	beforeEach(() => {
		mockBookService = jasmine.createSpyObj('BookService', ['getAllBooks', 'setBooks']);
		mockTagService = jasmine.createSpyObj('TagService', ['getAllTags', 'setTags']);
		mockCollectionService = jasmine.createSpyObj('CollectionService', ['getAllCollections', 'setCollections']);
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				DataStorageService,
				{ provide: BookService, useValue: mockBookService },
				{ provide: TagService, useValue: mockTagService },
				{ provide: CollectionService, useValue: mockCollectionService }
			]
		});
		service = TestBed.inject(DataStorageService);
		controller = TestBed.inject(HttpTestingController);
		service['authService'].user.next(new User('test@test.com', '123', 'abc', new Date()));
	});

	it('stores data to database', () => {
		spyOn(service, 'storeData').and.callThrough();
		service.storeData();
		expect(service.storeData).toHaveBeenCalled();
		expect(mockBookService.getAllBooks).toHaveBeenCalled();
		expect(mockTagService.getAllTags).toHaveBeenCalled();
		expect(mockCollectionService.getAllCollections).toHaveBeenCalled();
	})

	it('fetches data from database and returns empty book, tag, and collection array when response is empty', () => {
		service.fetchData();
		const request = controller.expectOne(`${environment.firebaseEndpoint}123.json?auth=abc`);
		request.flush({ });
		expect(mockTagService.setTags).toHaveBeenCalledWith([]);
		expect(mockBookService.setBooks).toHaveBeenCalledWith([]);
		expect(mockCollectionService.setCollections).toHaveBeenCalledWith([]);
	});

	it('fetches data from database and returns empty tag & collection array when only books exist', () => {
		let testBooks = structuredClone(testData.books);
		service.fetchData();
		const request = controller.expectOne(`${environment.firebaseEndpoint}123.json?auth=abc`);
		request.flush({ books: testBooks });
		expect(mockTagService.setTags).toHaveBeenCalledWith([]);
		expect(mockCollectionService.setCollections).toHaveBeenCalledWith([]);
		expect(mockBookService.setBooks).toHaveBeenCalledWith(testBooks);
	});

	it('fetches data from database and returns book, tag, and collection data when data exists', () => {
		let testBook = structuredClone(testData.books[2]);
		testBook.dateCreated = undefined;
		testBook.dateUpdated = undefined;
		testBook.tags = undefined;
		
		let testTag = structuredClone(testData.tags[2]);
		testTag.description = undefined;

		let testCollection = structuredClone(testData.collections[1]);

		service.fetchData();
		const request = controller.expectOne(`${environment.firebaseEndpoint}123.json?auth=abc`);
		request.flush({ books: [testBook], tags: [testTag], collections: [testCollection] });

		testBook.dateCreated = null;
		testBook.dateUpdated = null;
		testBook.tags = [];

		testTag.description = null;

		expect(mockTagService.setTags).toHaveBeenCalledWith([testTag]);
		expect(mockBookService.setBooks).toHaveBeenCalledWith([testBook]);
		expect(mockCollectionService.setCollections).toHaveBeenCalledWith([testCollection]);
	});
});
