import { TestBed } from '@angular/core/testing';

import { TagService } from './tag.service';
import { testData } from 'src/test-data/test-data';
import { Tag } from '../models/tag.model';

describe('TagService', () => {
  	let service: TagService;
	let controlGroup: Tag[];

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TagService);
		service['tags'] = structuredClone(testData.tags);
		controlGroup = testData.tags.slice();
	});

	it('should return all tags', () => {
		expect(service.getAllTags()).toEqual(controlGroup);
	});

	it('should return a tag by case-insensitive name', () => {
		expect(service.getTagByName('three')).toEqual(controlGroup[5]);
		expect(service.getTagByName('tHrEE')).toEqual(controlGroup[5]);
	});

	it('should return undefined for a tag that does not exist', () => {
		expect(service.getTagByName('nonexistent')).toBeUndefined();
	});

	it('should return true if a tag exists by case-insensitive name', () => {
		expect(service.tagExists('textbook')).toBeTrue();
		expect(service.tagExists('tEXtBoOk')).toBeTrue();
	});

	it('should return false if a tag does not exist', () => {
		expect(service.tagExists('nonexistent')).toBeFalse();
	});

	it('should add a new tag if it does not exist', () => {
		service.addTag('new');
		expect(service.getAllTags().length).toBe(controlGroup.length + 1);
		expect(service.getTagByName('new')).toEqual(new Tag('new', 1, null));
	});

	it('should increment the amount of an existing tag if it exists', () => {
		service.addTag('ZerO');
		expect(service.getTagByName('zero').amount).toBe(2);
	});

	it('should delete a tag by case-insensitive name', () => {
		service.deleteTag('oNE');
		expect(service.getAllTags().length).toBe(controlGroup.length - 1);
		expect(service.getTagByName('one')).toBeUndefined();
	});

	it('should remove a tag if its amount is 1 before decrement', () => {
		service.removeTag('FOur');
		expect(service.getAllTags().length).toBe(controlGroup.length - 1);
		expect(service.getTagByName('four')).toBeUndefined();
	});

	it('should decrement the amount of an existing tag if it exists and has an amount greater than 1', () => {
		service.removeTag('test');
		expect(service.getTagByName('test').amount).toBe(1);
	});

	it('should not decrement the amount of a tag if it does not exist', () => {
		service.removeTag('nonexistent');
		expect(service.getAllTags().length).toBe(controlGroup.length);
	});

	it('should update the name of a tag by case-insensitive name', () => {
		service.updateTagName('bOOk', 'nEW');
		let updatedTag = service.getTagByName('new');
		expect(updatedTag.name).toEqual('nEW');
		expect(updatedTag.amount).toBe(4);
		expect(updatedTag.description).toEqual('This is a book!');
		expect(service.getTagByName('bOOk')).toBeUndefined();
	});

	it('should update the description of a tag by case-insensitive name', () => {
		service.updateTagDescription('educational', 'new description');
		let updatedTag = service.getTagByName('educational');
		expect(updatedTag.name).toEqual('educational');
		expect(updatedTag.amount).toBe(1);
		expect(updatedTag.description).toEqual('new description');
	});
});
