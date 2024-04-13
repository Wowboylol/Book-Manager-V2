import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
					console.log(response);
				}
			);
	}

	fetchData() {
		this.http.get<{ tags: Tag[], books: Book[] }>(`${environment.firebaseEndpoint}data.json`)
			.subscribe(
				data => {
					console.log(data);
					this.tagService.setTags(data['tags']);
					this.bookService.setAndParseBooks(data['books']);
				}
			);
	}
}
