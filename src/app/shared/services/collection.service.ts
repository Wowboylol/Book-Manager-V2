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
		return this.collections.find(collection => collection.name.toLowerCase() === collectionName.toLowerCase());
	}

	// Increments collection book amount if it exists, otherwise adds a new collection
	addCollection(collectionName: string): void {
		let collection = this.collections.find(collection => collection.name.toLowerCase() === collectionName.toLowerCase());
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
		this.collections = this.collections.filter(collection => collection.name.toLowerCase() !== collectionName.toLowerCase());
		this.collectionsChanged.next(this.collections.slice());
	}

	// Decrements amount of collection if it exists and has an amount greater than 1 (case-insensitive)
	// Otherwise, removes the collection
	removeCollection(collectionName: string): void {
		let collection = this.collections.find(collection => collection.name.toLowerCase() === collectionName.toLowerCase());
		if(collection) {
			if(collection.amount > 1) {
				collection.amount--;
				this.collectionsChanged.next(this.collections.slice());
			} 
			else {
				this.deleteCollection(collectionName);
			}
		}
	}
}
