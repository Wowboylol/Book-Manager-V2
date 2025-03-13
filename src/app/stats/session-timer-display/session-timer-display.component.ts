import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { AuthService, TokenResponseData } from 'src/app/shared/services/auth.service';
import { AlertComponent } from 'src/app/shared/components/alert/alert.component';

@Component({
	selector: 'app-session-timer-display',
	standalone: true,
	imports: [CommonModule, AlertComponent],
	templateUrl: './session-timer-display.component.html',
	styleUrls: ['./session-timer-display.component.css']
})
export class SessionTimerDisplayComponent implements OnInit, OnDestroy 
{
	// Session time display data
	private sessionUpdateInterval: any;
	private expirationTimestamp: number = 0;
	remainingSessionTime: number = 0;

	// Refresh session data
	canRefreshSession: boolean = false;
	alertToggle: string = 'hidden';
	alertMessage: string = null;
	alertType: string = 'success';

	constructor(private authService: AuthService) { }

	ngOnInit(): void { 
		this.setExpirationTimestamp();
		this.updateSessionTimeDisplay();
		this.sessionUpdateInterval = setInterval(() => { this.updateSessionTimeDisplay(); }, 1000);
	}

	ngOnDestroy(): void { 
		if(this.sessionUpdateInterval) {
			clearInterval(this.sessionUpdateInterval);
		}
	}

	// Initialize expiration timestamp
	private setExpirationTimestamp(): void {
		const userData = localStorage.getItem('user-data');
		if(!userData) { return }

		try {
			const parsedData = JSON.parse(userData);
			this.expirationTimestamp = new Date(parsedData._tokenExpirationDate).getTime();
		}
		catch(error) {
			console.error('Failed to parse user data for session timer:', error);
			this.expirationTimestamp = 0;
		}
	}

	// Update session time display
	private updateSessionTimeDisplay(): void {
		if(!this.expirationTimestamp) { return; }
		this.remainingSessionTime = this.expirationTimestamp - Date.now();
		this.canRefreshSession = this.remainingSessionTime < 2700000;
	}

	// Refresh session and update expiration timestamp
	refreshSession(): void {
		if(!this.canRefreshSession) { return; }
		this.canRefreshSession = false;

		const userData = JSON.parse(localStorage.getItem('user-data'));
		let authObservable: Observable<TokenResponseData>;

		authObservable = this.authService.refreshSession(userData._refreshToken);
		authObservable.subscribe({
			next: response => {
				this.setExpirationTimestamp();
				this.updateSessionTimeDisplay();
				this.alertMessage = 'Session refreshed successfully!';
				this.alertType = 'success';
				this.runAlert();
			},
			error: errorMessage => {
				this.alertMessage = errorMessage;
				this.alertType = 'danger';
				this.runAlert();
			}
		});
	}

	// Runs the alert component animation
	private runAlert(): void {
		if(this.alertToggle === 'hidden')
		{
			this.alertToggle = 'show';
			setTimeout(() => {
				this.alertToggle = 'hidden';
			}, 3000);			
		}
	}
}
