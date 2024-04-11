import { Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Book } from '../../shared/models/book.model';
import { BookDisplayType } from '../book-display-type.model';
import { TagService } from 'src/app/shared/services/tag.service';
import { TooltipDirective } from 'src/app/shared/directives/tooltip.directive';

@Component({
	selector: 'app-book-item',
	standalone: true,
	imports: [CommonModule, RouterModule, TooltipDirective],
	templateUrl: './book-item.component.html',
	styleUrls: ['./book-item.component.css']
})
export class BookItemComponent implements OnDestroy
{
	// Book item data
	@Input() book: Book;
	@Input() displayStyle: BookDisplayType
	readonly displayEnum = BookDisplayType;
	stars: number[] = [1, 2, 3, 4, 5];

	// Dynamic styling data
	@ViewChild('imageContainer') imageContainer: ElementRef;
	@ViewChild('detailsContainer') detailsContainer: ElementRef;
	resizeObserver: ResizeObserver = new ResizeObserver(entries => {
		entries.forEach(entry => {
			this.fillImageGap(entry.target.clientHeight);
		});
	});

	constructor(private tagService: TagService, private renderer: Renderer2) { }

	ngOnDestroy(): void {
		this.resizeObserver.disconnect();
	}

	getTagAmount(name: string): number {
		return this.tagService.getTagByName(name).amount;
	}

	getTagDescription(name: string): string {
		return this.tagService.getTagByName(name).description;
	}

	// Run fillImageGap() and observes image height changes after image load
	onImageLoad(event: Event) {
		const imageElement = event.target as HTMLImageElement;
		this.fillImageGap(imageElement.height);
		this.resizeObserver.observe(imageElement);
	}

	// Fills gap between image and details container if image is smaller than details container (only for grid view)
	private fillImageGap(imageElementHeight: number) {
		if(this.displayStyle === BookDisplayType.List) {
			this.renderer.setStyle(this.detailsContainer.nativeElement, 'margin-top', '0px');
		}
		else {
			const imageGap = this.imageContainer.nativeElement.clientHeight - imageElementHeight;
			if(imageGap > 0) {
				this.renderer.setStyle(this.detailsContainer.nativeElement, 'margin-top', `-${imageGap}px`);
			}
		}
	}
}
