import { DOCUMENT } from '@angular/common';
import { Directive, HostListener, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
	selector: '[appTooltip]',
	standalone: true
})
export class TooltipDirective implements OnDestroy
{
  	@Input() appTooltip: string = null;
	@Input() displayDelay?: number = 750;
	private tooltipElement: HTMLElement;
	private timer;
	
	constructor(
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2
	) { }

	ngOnDestroy(): void { 
		if (this.tooltipElement) {
			this.renderer.removeChild(this.document.body, this.tooltipElement);
		}
	}

	@HostListener('mouseenter', ['$event']) onMouseEnter(event: MouseEvent) {
		this.timer = setTimeout(() => {
			this.createTooltip(event.clientX, event.clientY);
		}, this.displayDelay);
	}

	@HostListener('mouseleave') onMouseLeave() {
		if(this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if(this.tooltipElement) {
			this.renderer.removeChild(this.document.body, this.tooltipElement);
		}
	}

	private createTooltip(x: number, y: number) 
	{
		const tooltip = this.renderer.createElement('div');
		this.renderer.setProperty(tooltip, 'innerText', this.appTooltip ? this.appTooltip : 'No description available.');
		this.renderer.setStyle(tooltip, 'left', x.toString() + 'px');
		this.renderer.setStyle(tooltip, 'top', y.toString() + 'px');
		this.renderer.addClass(tooltip, 'tooltip-container');
		this.renderer.appendChild(this.document.body, tooltip);
		this.tooltipElement = tooltip;
	}
}
