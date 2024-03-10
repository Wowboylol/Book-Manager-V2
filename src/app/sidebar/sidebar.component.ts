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
	currentActiveTab: string = 'Books';

	constructor(private themeService: ThemeService) { }

	ngOnInit(): void 
	{ 
		this.themeService.themeChanged.subscribe((darkMode: boolean) => {
			this.darkMode = darkMode;
			this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
		});
	}

	toggleSidebar() { 
		this.close = !this.close; 
	}

	toggleMode() { 
		this.darkMode = !this.darkMode;
		this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
		this.themeService.setDarkMode(this.darkMode); 
	}

	changeActiveTab(tab: string) { 
		this.currentActiveTab = tab; 
	}
}
