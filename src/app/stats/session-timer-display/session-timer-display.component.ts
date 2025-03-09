import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-session-timer-display',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './session-timer-display.component.html',
	styleUrls: ['./session-timer-display.component.css']
})
export class SessionTimerDisplayComponent implements OnInit, OnDestroy 
{
	// Session time display data
	private sessionUpdateInterval: any;
	private expirationTimestamp: number = 0;
	remainingSessionTime: number = 0;

	constructor() { }

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
	}
}
