import { Injectable } from '@angular/core';

import { Tag } from '../models/tag.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TagService 
{
	private tags: Tag[] = [];
	tagsChanged = new Subject<Tag[]>();

	constructor() { }

	// Return a copy of the array of tags
	getAllTags(): Tag[] {
		return this.tags.slice();
	}

	// Set current tags to the given array of tags
	setTags(tags: Tag[]): void {
		this.tags = tags;
		this.tagsChanged.next(this.tags.slice());
	}

	// Returns the tag with the given name, or undefined if not found (case-insensitive)
	getTagByName(name: string): Tag {
		var nameLower = name.toLowerCase();
		return this.tags.find(tag => tag.name.toLowerCase() === nameLower);
	}

	// Checks if the tag with the given name exists (case-insensitive)
	tagExists(name: string): boolean {
		var nameLower = name.toLowerCase();
		return this.tags.some(tag => tag.name.toLowerCase() === nameLower);
	}

	// Increments tag amount if it exists, otherwise adds a new tag
	addTag(name: string): void {
		var nameLower = name.toLowerCase();
		let tag = this.tags.find(tag => tag.name.toLowerCase() === nameLower);
		if(tag) {
			tag.amount++;
		} 
		else {
			this.tags.push(new Tag(name, 1, null));
		}
		this.tagsChanged.next(this.tags.slice());
	}

	// Deletes the tag with the given name regardless of its amount (case-insensitive)
	// Postcondition: The deleted tag should be removed from all books
	deleteTag(name: string): void {
		var nameLower = name.toLowerCase();
		this.tags = this.tags.filter(tag => tag.name.toLowerCase() !== nameLower);
		this.tagsChanged.next(this.tags.slice());
	}

	// Decrements amount of tag if it exists and has an amount greater than 1 (case-insensitive)
	// Otherwise, removes the tag
	removeTag(name: string): void {
		var nameLower = name.toLowerCase();
		let tag = this.tags.find(tag => tag.name.toLowerCase() === nameLower);
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
		var oldNameLower = oldName.toLowerCase();
		let tag = this.tags.find(tag => tag.name.toLowerCase() === oldNameLower);
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
		var nameLower = name.toLowerCase();
		let tag = this.tags.find(tag => tag.name.toLowerCase() === nameLower);
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
