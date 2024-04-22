import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-collections',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './collections.component.html',
	styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit 
{
	constructor() { }
	ngOnInit(): void { }
}
