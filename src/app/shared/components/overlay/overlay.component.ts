import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-overlay',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './overlay.component.html',
	styleUrls: ['./overlay.component.css']
})
export class OverlayComponent
{
	overlayTitle = 'Overlay Title';

	constructor() { }

	updateOverlayTitle(displayedComponent): void {
		this.overlayTitle = displayedComponent.overlayTitle;
	}
}
