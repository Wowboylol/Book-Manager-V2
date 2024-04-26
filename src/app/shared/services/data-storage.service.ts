import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment.prod';
import { BookService } from './book.service';
import { TagService } from './tag.service';
import { CollectionService } from './collection.service';
import { Tag } from '../models/tag.model';
import { Book } from '../models/book.model';
import { Collection } from '../models/collection.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService 
{
	constructor(
		private http: HttpClient, 
		private bookService: BookService, 
		private tagService: TagService,
		private collectionService: CollectionService, 
		private authService: AuthService
	) { }

	storeData() {
		const books = this.bookService.getAllBooks();
		const tags = this.tagService.getAllTags();
		const collections = this.collectionService.getAllCollections();

		this.http.put(
			environment.firebaseEndpoint + this.authService.user.value.id + '.json?auth=' + this.authService.user.value.token, 
			{ tags, books, collections }
		)
		.subscribe(
			response => {
				console.log('Stored data:', response);
			}
		);
	}

	fetchData() {
		this.http.get<{ tags: Tag[], books: Book[], collections: Collection[] }>(
			environment.firebaseEndpoint + this.authService.user.value.id + '.json?auth=' + this.authService.user.value.token
		)
		.pipe( 
			map(data => {
				if(!data || !data.books) { return { tags: [], books: [], collections: [] }; }
				if(!data.tags) { data.tags = []; }
				if(!data.collections) { data.collections = []; }
				return {
					tags: data.tags.map(tag => {
						return {...tag, description: tag.description ? tag.description : null};
					}),
					books: data.books.map(book => {
						return {
							...book,
							dateCreated: book.dateCreated ? new Date(book.dateCreated) : null,
							dateUpdated: book.dateUpdated ? new Date(book.dateUpdated) : null,
							tags: book.tags ? book.tags : []
						};
					}),
					collections: data.collections
				}
			})
		)
		.subscribe(
			data => {
				console.log('Fetched data:', data);
				this.tagService.setTags(data['tags']);
				this.bookService.setBooks(data['books']);
				this.collectionService.setCollections(data['collections']);
			}
		);
	}
}
