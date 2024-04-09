import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-overlay',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './overlay.component.html',
	styleUrls: ['./overlay.component.css']
})
export class OverlayComponent implements OnInit, OnDestroy
{
	overlayTitle = new Promise<string>((resolve, reject) => resolve('Overlay Title'));

	constructor(
		@Inject(DOCUMENT) private document: Document, 
		private renderer: Renderer2
	) { }

	ngOnInit(): void { 
		this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
	}

	ngOnDestroy(): void {
		this.renderer.removeStyle(this.document.body, 'overflow');
	}

	updateOverlayTitle(displayedComponent): void {
		this.overlayTitle = displayedComponent.overlayTitle;
	}
}
