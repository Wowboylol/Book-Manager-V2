import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { TagSearchComponent } from './tag-search/tag-search.component';
import { Tag } from '../shared/models/tag.model';
import { TagService } from '../shared/services/tag.service';
import { BookService } from '../shared/services/book.service';
import { ConfirmComponent } from '../shared/components/confirm/confirm.component';

@Component({
	selector: 'app-tags',
	standalone: true,
	imports: [CommonModule, FormsModule, TagSearchComponent, ConfirmComponent],
	templateUrl: './tags.component.html',
	styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit, OnDestroy 
{
	// Tag component data
	@ViewChild('tagForm') tagForm: NgForm;
	private tagsChangedSubscription: Subscription;
	tags: Tag[] = [];
	selectedTagName: string = null;

	// Confirm delete component data
	showConfirmDelete: boolean = false;
	confirmDeleteMessage: string = `Are you sure you want to delete the tag "${this.selectedTagName}"? This action is irreversible, and will remove the tag from all books.`;

	constructor(private tagService: TagService, private bookService: BookService) { }

	ngOnInit(): void { 
		this.tags = this.tagService.getAllTags();
		this.tagsChangedSubscription = this.tagService.tagsChanged
			.subscribe((tags: Tag[]) => {
				this.tags = tags;
			}
		);
	}

	ngOnDestroy(): void {
		this.tagsChangedSubscription.unsubscribe();
	}

	onSelectTag(tag: Tag): void {
		this.selectedTagName = tag.name;
		this.tagForm.setValue({ 
			name: tag.name,
			description: tag.description
		});
	}

	onUpdate(): void {
		const newTagName = this.tagForm.value.name;
		const newTagDescription = this.tagForm.value.description;
		this.tagService.updateTagName(this.selectedTagName, newTagName);
		this.bookService.updateTagInBooks(this.selectedTagName, newTagName);
		this.tagService.updateTagDescription(newTagName, newTagDescription);
		this.onClear();
	}

	onClear(): void {
		this.tagForm.reset();
		this.selectedTagName = null;
	}

	isValidTagName(): boolean {
		if(!this.tagForm?.value?.name) return false;
		if(this.selectedTagName === this.tagForm.value.name) return true;
		return !this.tagService.tagExists(this.tagForm.value.name);
	}
}
