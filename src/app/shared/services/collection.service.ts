import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Collection } from '../models/collection.model';

@Injectable({ providedIn: 'root' })
export class CollectionService 
{
	private collections: Collection[] = [];
	collectionsChanged = new Subject<Collection[]>();

  	constructor() { }

	// Return a copy of the array of collections
	getAllCollections(): Collection[] {
		return this.collections.slice();
	}

	// Set current collections to the given array of collections
	setCollections(collections: Collection[]): void {
		this.collections = collections;
		this.collectionsChanged.next(this.collections.slice());
	}

	// Returns the collection with the given name, or undefined if not found (case-insensitive)
	getCollectionByName(collectionName: string): Collection {
		var collectionNameLower = collectionName.toLowerCase();
		return this.collections.find(collection => collection.name.toLowerCase() === collectionNameLower);
	}

	// Checks if the collection with the given name exists (case-insensitive)
	collectionExists(collectionName: string): boolean {
		var collectionNameLower = collectionName.toLowerCase();
		return this.collections.some(collection => collection.name.toLowerCase() === collectionNameLower);
	}

	// Increments collection book amount if it exists, otherwise adds a new collection
	addCollection(collectionName: string): void {
		var collectionNameLower = collectionName.toLowerCase();
		let collection = this.collections.find(collection => collection.name.toLowerCase() === collectionNameLower);
		if(collection) {
			collection.amount++;
		} 
		else {
			this.collections.push(new Collection(collectionName, 1, 'black'));
		}
		this.collectionsChanged.next(this.collections.slice());
	}

	// Deletes the collection with the given name regardless of its amount (case-insensitive)
	// Postcondition: The deleted collection should be removed from all books
	deleteCollection(collectionName: string): void {
		var collectionNameLower = collectionName.toLowerCase();
		this.collections = this.collections.filter(collection => collection.name.toLowerCase() !== collectionNameLower);
		this.collectionsChanged.next(this.collections.slice());
	}

	// Decrements amount of collection if it exists (case-insensitive)
	removeCollection(collectionName: string): void {
		var collectionNameLower = collectionName.toLowerCase();
		let collection = this.collections.find(collection => collection.name.toLowerCase() === collectionNameLower);
		if(collection) {
			collection.amount--;
			this.collectionsChanged.next(this.collections.slice());
		}
	}

	// Updates the color of the collection with the given name (case-insensitive)
	updateCollectionColor(collectionName: string, color: string): void {
		var collectionNameLower = collectionName.toLowerCase();
		let collection = this.collections.find(collection => collection.name.toLowerCase() === collectionNameLower);
		try {
			if(collection) {
				collection.color = color;
				this.collectionsChanged.next(this.collections.slice());
			}
			else { throw new Error('Collection not found'); }
		}
		catch(e) {
			console.error(e);
		}
	}

	// Updates the name of the collection with the given name
	// Postcondition: The collection name should be updated in all books
	updateCollectionName(collectionName: string, newName: string): void {
		var collectionNameLower = collectionName.toLowerCase();
		let collection = this.collections.find(collection => collection.name.toLowerCase() === collectionNameLower);
		try {
			if(collection) {
				collection.name = newName;
				this.collectionsChanged.next(this.collections.slice());
			}
			else { throw new Error('Collection not found'); }
		}
		catch(e) {
			console.error(e);
		}
	}
}
