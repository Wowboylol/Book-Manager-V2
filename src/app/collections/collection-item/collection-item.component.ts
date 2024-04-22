import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-collection-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './collection-item.component.html',
    styleUrls: ['./collection-item.component.css']
})
export class CollectionItemComponent implements OnInit 
{
    constructor() { }
    ngOnInit(): void { }
}