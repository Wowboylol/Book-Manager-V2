import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';

import { Book } from 'src/app/shared/models/book.model';
import { BookService } from '../../shared/services/book.service';
import { TagService } from '../../shared/services/tag.service';
import { TooltipDirective } from 'src/app/shared/directives/tooltip.directive';

@Component({
	selector: 'app-book-detail',
	standalone: true,
	imports: [CommonModule, TooltipDirective],
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit 
{
	overlayTitle = 'View Book';
	stars: number[] = [1, 2, 3, 4, 5];
	book: Book;
	
	constructor(private route: ActivatedRoute, private bookService: BookService, private tagService: TagService) { }

	ngOnInit(): void 
	{ 
		this.route.params.subscribe(
			(params: Params) => {
				let bookId = +params['id'];
				this.book = this.bookService.getBookById(bookId);
			}
		);
	}

	getTagAmount(name: string): number {
		return this.tagService.getTagByName(name).amount;
	}

	getTagDescription(name: string): string {
		return this.tagService.getTagByName(name).description;
	}
}
