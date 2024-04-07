import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { Book } from 'src/app/shared/models/book.model';
import { BookService } from '../../shared/services/book.service';
import { TagService } from '../../shared/services/tag.service';
import { TooltipDirective } from 'src/app/shared/directives/tooltip.directive';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
	selector: 'app-book-detail',
	standalone: true,
	imports: [CommonModule, TooltipDirective, ConfirmComponent, RouterModule],
	templateUrl: './book-detail.component.html',
	styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit 
{
	// Book data
	overlayTitle = 'View Book';
	stars: number[] = [1, 2, 3, 4, 5];
	book: Book;

	// Confirm delete modal data
	showConfirmDelete: boolean = false;
	confirmDeleteMessage: string = null;
	
	constructor(
		private route: ActivatedRoute, 
		private bookService: BookService, 
		private tagService: TagService, 
		private router: Router
	) { }

	ngOnInit(): void 
	{ 
		this.route.params.subscribe(
			(params: Params) => {
				let bookId = +params['id'];
				this.book = this.bookService.getBookById(bookId);
				this.confirmDeleteMessage = 
					`Are you sure you want to delete the book "${this.book.name}"? 
					This action is irreversible, and will remove the book from Book Manager.`;
			}
		);
	}

	// Gets the tag's amount given its name
	getTagAmount(name: string): number {
		return this.tagService.getTagByName(name).amount;
	}

	// Gets the tag's description given its name
	getTagDescription(name: string): string {
		return this.tagService.getTagByName(name).description;
	}

	// Ran after deletion is confirmed to delete the selected book
	onDelete(): void {
		this.book.tags.forEach(tag => {
			this.tagService.removeTag(tag);
		});
		this.bookService.deleteBook(this.book.id);
		this.showConfirmDelete = false;
		this.router.navigate(['/books']);
	}
}
