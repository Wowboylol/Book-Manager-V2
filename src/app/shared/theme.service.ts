import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService 
{
	private darkMode: boolean = false;

	isDarkMode() { return this.darkMode; }

	setDarkMode(isDarkMode: boolean) 
	{
		this.darkMode = isDarkMode;
		if (this.darkMode) {
			document.body.classList.add('dark-mode');
		} 
		else {
			document.body.classList.remove('dark-mode');
		}
	}
}
