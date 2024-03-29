import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ThemeService } from '../shared/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy 
{
	private themeChangedSubscription: Subscription;
	close: boolean = true;
	darkMode: boolean;
	modeText: string;

	constructor(private themeService: ThemeService) { 
		this.darkMode = themeService.isDarkMode();
		this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
	}

	ngOnInit(): void 
	{ 
		this.themeChangedSubscription = this.themeService.themeChanged
			.subscribe((darkMode: boolean) => {
				this.darkMode = darkMode;
				this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
			}
		);
	}

	ngOnDestroy(): void { 
		this.themeChangedSubscription.unsubscribe(); 
	}

	toggleSidebar() { 
		this.close = !this.close; 
	}

	toggleMode() { 
		this.darkMode = !this.darkMode;
		this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
		this.themeService.setDarkMode(this.darkMode); 
	}
}
