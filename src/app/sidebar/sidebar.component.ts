import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeService } from '../shared/theme.service';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
	providers: [ThemeService]
})
export class SidebarComponent implements OnInit 
{
	close: boolean = true;
	darkMode: boolean = false;
	modeText: string = 'Dark Mode';

	constructor(private themeService: ThemeService) { }

	ngOnInit(): void { }

	toggleSidebar() { this.close = !this.close; }

	toggleMode() { 
		this.darkMode = !this.darkMode;
		this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
		this.themeService.setDarkMode(this.darkMode); 
	}
}