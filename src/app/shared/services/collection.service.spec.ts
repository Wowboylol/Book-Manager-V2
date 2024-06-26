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

	it('should return true if a collection exists by case-insensitive name', () => {
		expect(service.collectionExists('Best Books')).toBeTrue();
		expect(service.collectionExists('BEsT BoOkS')).toBeTrue();
	});

	it('should return false if a collection does not exist', () => {
		expect(service.collectionExists('nonexistent')).toBeFalse();
	});

	it('should add a new collection if it does not exist', () => {
		service.addCollection('new');
		expect(service.getAllCollections().length).toBe(controlGroup.length + 1);
		expect(service.getCollectionByName('new')).toEqual(new Collection('new', 1, 'black'));
	});

	it('should increment the amount of an existing collection if it exists', () => {
		service.addCollection('TesT CollEctIon');
		expect(service.getCollectionByName('Test Collection').amount).toBe(3);
	});

	it('should delete a collection by case-insensitive name', () => {
		service.deleteCollection('BeSt BOOks');
		expect(service.getAllCollections().length).toBe(controlGroup.length - 1);
		expect(service.getCollectionByName('Best Books')).toBeUndefined();
	});

	it('should decrement the amount of an existing collection if it exists', () => {
		service.removeCollection('TESt COllectIon');
		expect(service.getCollectionByName('Test Collection').amount).toBe(1);
	});

	it('should not decrement the amount of a collection if it does not exist', () => {
		service.removeCollection('nonexistent');
		expect(service.getAllCollections()).toEqual(controlGroup);
	});

	it('should update the color of a collection by case-insensitive name', () => {
		service.updateCollectionColor('TeST CoLlEcTion', '#d916c2');
		expect(service.getCollectionByName('Test Collection').color).toBe('#d916c2');
	});

	it('should update the name of a collection by case-insensitive name', () => {
		service.updateCollectionName('TeST ColLEctiON', 'New Name');
		expect(service.getCollectionByName('Test Collection')).toBeUndefined();
		expect(service.getCollectionByName('New Name').amount).toBe(2);
		expect(service.getCollectionByName('New Name').color).toBe('red');
	});
});
