import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ThemeService } from '../shared/services/theme.service';
import { DropdownDirective } from '../shared/directives/dropdown.directive';
import { DataStorageService } from '../shared/services/data-storage.service';
import { AlertComponent } from '../shared/components/alert/alert.component';
import { ConfirmComponent } from '../shared/components/confirm/confirm.component';
import { BookService } from '../shared/services/book.service';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [CommonModule, RouterModule, DropdownDirective, AlertComponent, ConfirmComponent],
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy 
{
	// Sidebar styling data
	private themeChangedSubscription: Subscription;
	close: boolean = true;
	isMobile: boolean;
	darkMode: boolean;
	modeText: string;

	// Dynamic component data (alert and confirm)
	alertToggle: string = 'hidden';
	alertMessage: string = '';
	alertType: string = '';
	dataServiceCooldownTimer = null;
	showConfirmSave: boolean = false;

	// Authenticaion data
	private authSubscription: Subscription;
	isLoggedIn: boolean = false;

	constructor(
		private themeService: ThemeService, 
		private dataStorageService: DataStorageService,
		private bookService: BookService, 
		private authService: AuthService
	) { 
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

		this.authSubscription = this.authService.user
			.subscribe((user: User) => {
				this.isLoggedIn = !!user;
			}
		);
	}

	ngOnDestroy(): void { 
		this.themeChangedSubscription.unsubscribe(); 
		this.authSubscription.unsubscribe();
	}

	// Toggle between dark and light mode
	toggleMode(): void { 
		this.darkMode = !this.darkMode;
		this.modeText = this.darkMode ? 'Light Mode' : 'Dark Mode';
		this.themeService.setDarkMode(this.darkMode); 
	}

	// Runs when screen is resized
	onScreenResize(event): void {
		event.target.innerWidth < 768 ? this.isMobile = true : this.isMobile = false;
	}

	// Runs when user clicks on save data button
	onSaveData(): void {
		if(this.bookService.getAllBooks().length == 0 && !this.showConfirmSave) {
			this.showConfirmSave = true;
		}
		else if(!this.dataServiceCooldownTimer) {
			this.setDataServiceCooldownTimer();
			this.dataStorageService.storeData();
			this.showConfirmSave = false;
			this.alertMessage = 'Data saved successfully!';
			this.alertType = 'success';
			this.runAlert();
		}
		else {
			this.displayCooldownError();
		}
	}

	// Runs when user clicks on fetch data button
	onFetchData(): void {
		if(!this.dataServiceCooldownTimer) {
			this.setDataServiceCooldownTimer();
			this.dataStorageService.fetchData();
			this.alertMessage = 'Data fetched successfully!';
			this.alertType = 'success';
			this.runAlert();
		}
		else {
			this.displayCooldownError();
		}
	}

	// Runs when user clicks on logout button
	onLogout(): void {
		this.authService.logout();
	}

	// Sets a cooldown timer for the data service
	private setDataServiceCooldownTimer() {
		this.dataServiceCooldownTimer = setTimeout(() => {
			this.dataServiceCooldownTimer = null;
		}, 5000);
	}

	// Is called when user tries to save or fetch data before cooldown
	private displayCooldownError() {
		this.alertMessage = 'Please wait 5 seconds before trying again.';
		this.alertType = 'danger';
		this.runAlert();
	}

	// Runs the alert component animation
	runAlert(): void {
		if(this.alertToggle === 'hidden')
		{
			this.alertToggle = 'show';
			setTimeout(() => {
				this.alertToggle = 'hidden';
			}, 3000);			
		}
	}
}
