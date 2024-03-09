import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService 
{
	themeChanged = new Subject<boolean>();
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
		this.themeChanged.next(this.darkMode);
	}
}
