import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
	selector: 'app-alert',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.css'],
	animations: [
		trigger('alertDisplay', [
			state('hidden', style({
				transform: 'translate(-50%, 100%)',
			})),
			state('show', style({
				transform: 'translate(-50%, 0%)',
			})),
			transition('hidden => show', animate('300ms ease-out')),
			transition('show => hidden', animate('300ms ease-in'))
		])
	]
})
export class AlertComponent implements OnInit, OnDestroy 
{
	@Input() message: string;
	@Input() toggle: string = 'hidden';
	private themeChangedSubscription: Subscription;
	darkMode: boolean;

	constructor(private themeService: ThemeService) { }

	ngOnInit(): void 
	{ 
		this.darkMode = this.themeService.isDarkMode();
		this.themeChangedSubscription = this.themeService.themeChanged
			.subscribe((darkMode: boolean) => {
				this.darkMode = darkMode;
			}
		);
	}

	ngOnDestroy(): void { 
		this.themeChangedSubscription.unsubscribe(); 
	}
}
