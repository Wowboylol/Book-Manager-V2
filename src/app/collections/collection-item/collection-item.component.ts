import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Collection } from 'src/app/shared/models/collection.model';
import { BookService } from 'src/app/shared/services/book.service';
import { CollectionService } from 'src/app/shared/services/collection.service';
import { DropdownDirective } from 'src/app/shared/directives/dropdown.directive';
import { ConfirmComponent } from 'src/app/shared/components/confirm/confirm.component';

@Component({
    selector: 'app-collection-item',
    standalone: true,
    imports: [CommonModule, DropdownDirective, ConfirmComponent],
    templateUrl: './collection-item.component.html',
    styleUrls: ['./collection-item.component.css']
})
export class CollectionItemComponent implements OnInit 
{
    @Input() collection: Collection;
    showConfirmDelete: boolean = false;
    confirmDeleteMessage: string = null;

    constructor(private bookService: BookService, private collectionService: CollectionService) { }

    ngOnInit(): void { 
        this.confirmDeleteMessage = 
            `Are you sure you want to delete the collection "${this.collection.name}"? 
            This action is irreversible, and will remove all books from the collection.`;
    }

    getCollectionImage(): string {
        let booksWithCollection = this.bookService.getBooksByCollection(this.collection.name);
        return `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${booksWithCollection[0] ? booksWithCollection[0].imagePath : ''})`;
    }

    getCollectionColor(): string {
        return this.collection.color;
    }

    onUpdateColor(event: Event): void {
        let color = (event.target as HTMLInputElement).value;
        this.collectionService.updateCollectionColor(this.collection.name, color);
    }

    onDeleteCollection(): void {
        this.bookService.deleteCollectionFromBooks(this.collection.name);
        this.collectionService.deleteCollection(this.collection.name);
    }
}