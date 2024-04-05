import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

@Directive({
	selector: '[appTooltip]',
	standalone: true
})
export class TooltipDirective implements OnDestroy
{
  	@Input() appTooltip: string = null;
	@Input() displayDelay?: number = 1000;
	private tooltipElement: HTMLElement;
	private timer;
	
	constructor(private elementRef: ElementRef) { }

	ngOnDestroy(): void { 
		if (this.tooltipElement) {
			this.tooltipElement.remove();
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
			this.tooltipElement.remove();
		}
	}

	private createTooltip(x: number, y: number) 
	{
		let tooltip = document.createElement('div');
		tooltip.innerText = this.appTooltip ? this.appTooltip : 'No description available.';
		tooltip.style.left = x.toString() + 'px';
		tooltip.style.top = y.toString() + 'px';
		tooltip.setAttribute('class', 'tooltip-container');
		document.body.appendChild(tooltip);
		this.tooltipElement = tooltip;
	}
}
