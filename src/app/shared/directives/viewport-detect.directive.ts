import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';

@Directive({
	selector: '[appViewportDetect]',
	standalone: true
})
export class ViewportDetectDirective implements AfterViewInit, OnDestroy 
{
	@Output() enteredViewport = new EventEmitter<void>();
	@Output() exitedViewport = new EventEmitter<void>();
	private observer: IntersectionObserver;

	constructor(private element: ElementRef) { }

	ngAfterViewInit(): void {
		this.createObserver();
	}

	ngOnDestroy(): void {
		this.observer.disconnect();
	}

	private createObserver() {
		this.observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					this.enteredViewport.emit();
				} else {
					this.exitedViewport.emit();
				}
			});
		});
		this.observer.observe(this.element.nativeElement);
	}
}
