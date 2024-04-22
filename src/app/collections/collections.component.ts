import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { CollectionItemComponent } from './collection-item/collection-item.component';
import { Collection } from '../shared/models/collection.model';
import { CollectionService } from '../shared/services/collection.service';

@Component({
	selector: 'app-collections',
	standalone: true,
	imports: [CommonModule, CollectionItemComponent],
	templateUrl: './collections.component.html',
	styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit 
{
	private collectionsSubscription: Subscription;
	collections: Collection[] = [];

	constructor(private collectionService: CollectionService) { }

	ngOnInit(): void 
	{ 
		// Set default data
		this.collections = this.collectionService.getAllCollections();

		// Subscribe to collection changes
		this.collectionsSubscription = this.collectionService.collectionsChanged
			.subscribe((collections: Collection[]) => {
				this.collections = collections;
			}
		);
	}

	ngOnDestroy(): void {
		this.collectionsSubscription.unsubscribe();
	}
}
