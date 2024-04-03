import { Injectable } from '@angular/core';

import { Tag } from '../models/tag.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TagService 
{
	private tags: Tag[] = [];
	tagsChanged = new Subject<Tag[]>();

	constructor() { 
		let json = require('../../../test-data/book-snippet.json');
		this.tags = json.tags;
		this.tags = this.convertTagDates(this.tags);
	}

	// Converts tag lastUsed string into Date object
	// If the date string is null, the date is set to null
	private convertTagDates(tags: Tag[]): Tag[] {
		return tags.map(tag => {
			tag.lastUsed = tag.lastUsed ? new Date(tag.lastUsed) : null;
			return tag;
		});
	}

	// Return a copy of the array of tags
	getAllTags(): Tag[] {
		return this.tags.slice();
	}

	// Returns the tag with the given name, or undefined if not found (case-insensitive)
	getTagByName(name: string): Tag {
		return this.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
	}

	// Checks if the tag with the given name exists (case-insensitive)
	tagExists(name: string): boolean {
		return this.tags.some(tag => tag.name.toLowerCase() === name.toLowerCase());
	}

	// Increments amount of tag if it exists, otherwise adds a new tag
	// Updates the lastUsed date of the tag
	// Precondition: tag name must be unique
	addTag(name: string): void {
		let tag = this.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
		if(tag) {
			tag.amount++;
			tag.lastUsed = new Date();
		} 
		else {
			this.tags.push(new Tag(name, 1, new Date(), null));
		}
		this.tagsChanged.next(this.tags.slice());
	}

	// Deletes the tag with the given name regardless of its amount (case-insensitive)
	// Postcondition: The deleted tag should also be removed from all books
	deleteTag(name: string): void {
		this.tags = this.tags.filter(tag => tag.name.toLowerCase() !== name.toLowerCase());
		this.tagsChanged.next(this.tags.slice());
	}

	// Decrements amount of tag if it exists and has an amount greater than 1
	// Otherwise, removes the tag
	removeTag(name: string): void {
		let tag = this.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
		if(tag) {
			if(tag.amount > 1) {
				tag.amount--;
				this.tagsChanged.next(this.tags.slice());
			} 
			else {
				this.deleteTag(name);
			}
		}
	}

	// Updates the name of the tag with the given name (case-insensitive)
	// Postcondition: The updated tag should be updated in all books
	updateTagName(oldName: string, newName: string): void {
		let tag = this.tags.find(tag => tag.name.toLowerCase() === oldName.toLowerCase());
		try {
			if(tag) { tag.name = newName; }
			else { throw new Error('Tag not found'); }
		}
		catch(e) {
			console.error(e);
		}
		this.tagsChanged.next(this.tags.slice());
	}

	// Updates the description of the tag with the given name (case-insensitive)
	updateTagDescription(name: string, description: string): void {
		let tag = this.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
		try {
			if(tag) { tag.description = description; }
			else { throw new Error('Tag not found'); }
		}
		catch(e) {
			console.error(e);
		}
		this.tagsChanged.next(this.tags.slice());
	}
}
