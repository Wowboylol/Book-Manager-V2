import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Subscription } from 'rxjs';
import { ThemeService } from '../shared/services/theme.service';
import { DropdownDirective } from '../shared/directives/dropdown.directive';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule, RouterModule, DropdownDirective],
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy 
{
	private themeChangedSubscription: Subscription;
	close: boolean = true;
	isMobile: boolean;
	darkMode: boolean;
	modeText: string;

	constructor(private themeService: ThemeService) { 
		this.darkMode = themeService.isDarkMode();
		this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
		this.isMobile = window.innerWidth < 768 ? true : false;
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

	toggleMode() { 
		this.darkMode = !this.darkMode;
		this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
		this.themeService.setDarkMode(this.darkMode); 
	}

	onScreenResize(event) {
		event.target.innerWidth < 768 ? this.isMobile = true : this.isMobile = false;
	}
}
