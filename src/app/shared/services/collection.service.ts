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
}
