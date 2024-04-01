import { Injectable } from '@angular/core';

import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagService 
{
	private tags: Tag[] = [];

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
	addTag(name: string): void {
		let tag = this.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
		if(tag) {
			tag.amount++;
			tag.lastUsed = new Date();
		} 
		else {
			this.tags.push(new Tag(name, 1, new Date()));
		}
	}

	// Deletes the tag with the given name regardless of its amount (case-insensitive)
	deleteTag(name: string): void {
		this.tags = this.tags.filter(tag => tag.name.toLowerCase() !== name.toLowerCase());
	}

	// Decrements amount of tag if it exists and has an amount greater than 1
	// Otherwise, removes the tag
	removeTag(name: string): void {
		let tag = this.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
		if(tag) {
			if(tag.amount > 1) {
				tag.amount--;
			} 
			else {
				this.deleteTag(name);
			}
		}
	}
}
