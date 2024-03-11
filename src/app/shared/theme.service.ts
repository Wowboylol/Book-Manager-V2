import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService 
{
	themeChanged = new Subject<boolean>();
	private darkMode: boolean;

	constructor() 
	{
		const savedMode = localStorage.getItem('dark-mode');
		this.setDarkMode(savedMode === 'true' ? true : false)
	}

	isDarkMode() { return this.darkMode; }

	setDarkMode(isDarkMode: boolean) 
	{
		this.darkMode = isDarkMode;
		this.saveThemePreference();
		if (this.darkMode) {
			document.body.classList.add('dark-mode');
		} 
		else {
			document.body.classList.remove('dark-mode');
		}
		this.themeChanged.next(this.darkMode);
	}

	saveThemePreference() {
		localStorage.setItem('dark-mode', this.darkMode ? 'true' : 'false');
	}
}
