import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit 
{
	close: boolean = true;

	constructor() { }
	ngOnInit(): void { }

	toggleSidebar() { this.close = !this.close; }
}
