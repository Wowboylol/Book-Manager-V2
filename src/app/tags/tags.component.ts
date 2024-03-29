import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-tags',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tags.component.html',
	styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit 
{
	constructor() { }
	ngOnInit(): void { }
}
