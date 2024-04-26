import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-loading-spinner',
	standalone: true,
	imports: [CommonModule],
	template: '<div class="loader"></div>',
	styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent { }
