import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment.prod';
import { BookService } from './book.service';
import { TagService } from './tag.service';
import { Tag } from '../models/tag.model';
import { Book } from '../models/book.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService 
{
	constructor(
		private http: HttpClient, 
		private bookService: BookService, 
		private tagService: TagService
	) { }

	storeData() {
		const books = this.bookService.getAllBooks();
		const tags = this.tagService.getAllTags();

		this.http.put(`${environment.firebaseEndpoint}data.json`, { tags, books })
			.subscribe(
				response => {
					console.log('Stored data:', response);
				}
			);
	}

	fetchData() {
		this.http.get<{ tags: Tag[], books: Book[] }>(`${environment.firebaseEndpoint}data.json`)
			.pipe(
				map(data => {
					if(!data || !data.books) { return { tags: [], books: [] }; }
					if(!data.tags) { data.tags = []; }
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
						})
					}
				})
			)
			.subscribe(
				data => {
					console.log('Fetched data:', data);
					this.tagService.setTags(data['tags']);
					this.bookService.setBooks(data['books']);
				}
			);
	}
}
