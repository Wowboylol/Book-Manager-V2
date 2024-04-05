import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { TagSearchComponent } from './tag-search/tag-search.component';
import { Tag } from '../shared/models/tag.model';
import { TagService } from '../shared/services/tag.service';
import { BookService } from '../shared/services/book.service';
import { ConfirmComponent } from '../shared/components/confirm/confirm.component';
import { TooltipDirective } from '../shared/directives/tooltip.directive';
import { TagSearchQuery } from '../shared/models/tag-search-query.model';
import { TagSearchPipe } from '../shared/pipes/tag-search.pipe';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
	selector: 'app-tags',
	standalone: true,
	imports: [CommonModule, FormsModule, TagSearchComponent, ConfirmComponent, TooltipDirective, TagSearchPipe, AlertComponent],
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
	alertToggle: string = 'hidden';

	// Confirm delete component data
	showConfirmDelete: boolean = false;
	confirmDeleteMessage: string = null;

	// Search data
	searchQuery: TagSearchQuery;
	searchCount = { value: 0 };

	constructor(private tagService: TagService, private bookService: BookService) { }

	ngOnInit(): void { 
		// Set default data
		this.tags = this.tagService.getAllTags();
		this.searchCount.value = this.tags.length;

		// Subscribe to tag changes
		this.tagsChangedSubscription = this.tagService.tagsChanged
			.subscribe((tags: Tag[]) => {
				this.tags = tags;
				this.searchCount.value = this.tags.length;
			}
		);
	}

	ngOnDestroy(): void {
		this.tagsChangedSubscription.unsubscribe();
	}

	// Ran when a tag is selected from the list, populating the form with the tag's data
	onSelectTag(tag: Tag): void {
		this.selectedTagName = tag.name;
		this.confirmDeleteMessage = 
			`Are you sure you want to delete the tag "${this.selectedTagName}"? 
			This action is irreversible, and will remove the tag from all books.`;
		this.tagForm.setValue({ 
			name: tag.name,
			description: tag.description
		});
	}

	// Ran when the form is submitted to update the selected tag's name and (optionally) description
	onUpdate(): void {
		const newTagName = this.tagForm.value.name;
		const newTagDescription = this.tagForm.value.description;
		this.tagService.updateTagName(this.selectedTagName, newTagName);
		this.bookService.updateTagInBooks(this.selectedTagName, newTagName);
		this.tagService.updateTagDescription(newTagName, newTagDescription);
		this.onClear();
	}

	// Ran when the clear button is clicked to reset the form and selected tag
	onClear(): void {
		this.tagForm.reset();
		this.selectedTagName = null;
	}

	// Ran after deletion is confirmed to delete the selected tag
	onDelete(): void {
		this.tagService.deleteTag(this.selectedTagName);
		this.bookService.deleteTagFromBooks(this.selectedTagName);
		this.onClear();
		this.showConfirmDelete = false;
	}

	// Checks if the entered tag name is valid (unique or same as selected tag name, but cannot be null or empty)
	isValidTagName(): boolean {
		if(!this.tagForm?.value?.name) return false;
		if(this.selectedTagName === this.tagForm.value.name) return true;
		return !this.tagService.tagExists(this.tagForm.value.name);
	}

	// Updates the search query
	onSearchQuery(searchQuery:TagSearchQuery): void {
		this.searchQuery = searchQuery;
		this.runAlert();
	}

	// Runs the alert component animation
	runAlert(): void {
		this.alertToggle = 'show';
		setTimeout(() => {
			this.alertToggle = 'hidden';
		}, 3000);
	}
}
