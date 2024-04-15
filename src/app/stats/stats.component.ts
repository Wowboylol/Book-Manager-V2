import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-stats',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit 
{
	constructor() { }
	ngOnInit(): void { }
}
