import { TestBed } from '@angular/core/testing';

import { CollectionService } from './collection.service';
import { Collection } from '../models/collection.model';
import { testData } from 'src/test-data/test-data';

describe('CollectionService', () => {
	let service: CollectionService;
	let controlGroup: Collection[];

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CollectionService);
		service['collections'] = structuredClone(testData.collections);
		controlGroup = testData.collections.slice();
	});

	it('should return all collections', () => {
		expect(service.getAllCollections()).toEqual(controlGroup);
	});

	it('should set collections given an array of collections', () => {
		let newCollections = [
			new Collection('new1', 1, 'black'),
			new Collection('new2', 2, 'blue')
		];
		service.setCollections(newCollections);
		expect(service.getAllCollections()).toEqual(newCollections);
	});

	it('should return a collection by case-insensitive name', () => {
		expect(service.getCollectionByName('Best Books')).toEqual(controlGroup[1]);
		expect(service.getCollectionByName('BEsT BoOkS')).toEqual(controlGroup[1]);
	});

	it('should return undefined for a collection that does not exist', () => {
		expect(service.getCollectionByName('nonexistent')).toBeUndefined();
	});

	it('should add a new collection if it does not exist', () => {
		service.addCollection('new');
		expect(service.getAllCollections().length).toBe(controlGroup.length + 1);
		expect(service.getCollectionByName('new')).toEqual(new Collection('new', 1, 'black'));
	});

	it('should increment the amount of an existing collection if it exists', () => {
		service.addCollection('Test Collection');
		expect(service.getCollectionByName('Test Collection').amount).toBe(3);
	});

	it('should delete a collection by case-insensitive name', () => {
		service.deleteCollection('Best Books');
		expect(service.getAllCollections().length).toBe(controlGroup.length - 1);
		expect(service.getCollectionByName('Best Books')).toBeUndefined();
	});

	it('should decrement the amount of an existing collection if it exists', () => {
		service.removeCollection('Test Collection');
		expect(service.getCollectionByName('Test Collection').amount).toBe(1);
	});

	it('should not decrement the amount of a collection if it does not exist', () => {
		service.removeCollection('nonexistent');
		expect(service.getAllCollections()).toEqual(controlGroup);
	});
});
