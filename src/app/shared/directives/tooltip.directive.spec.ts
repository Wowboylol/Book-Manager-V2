import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TooltipDirective } from './tooltip.directive';
import { By } from '@angular/platform-browser';

@Component({
	standalone: true, 
	template: `<div [appTooltip]="'Test tooltip description'" [displayDelay]="'500'"></div>`,
	imports: [TooltipDirective]
})
class MockComponent { }

describe('TooltipDirective', () => {
	let fixture: ComponentFixture<MockComponent>;
	let directiveParent: HTMLElement;
	let testElement: DebugElement[];

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [TooltipDirective, MockComponent],
		})
		.createComponent(MockComponent);

		fixture.detectChanges();
		directiveParent = fixture.nativeElement.querySelector('div');
		testElement = fixture.debugElement.queryAll(By.directive(TooltipDirective));
	});

	it('should create tooltip element with given tooltip description on mouse enter', fakeAsync(() => {
		directiveParent.dispatchEvent(new MouseEvent('mouseenter'));
		tick(750);
		fixture.detectChanges();

		fixture.whenStable().then(() => {
			const tooltip = document.querySelector('.tooltip-container');
			expect(tooltip).toBeTruthy();
			expect(tooltip.textContent).toBe('Test tooltip description');
		});
	}));

	it('should remove tooltip element on mouse leave', fakeAsync(() => {
		const directive = testElement[0].injector.get(TooltipDirective) as TooltipDirective

		directiveParent.dispatchEvent(new MouseEvent('mouseenter'));
		tick(750);
		fixture.detectChanges();

		directiveParent.dispatchEvent(new MouseEvent('mouseleave'));
		fixture.detectChanges();

		fixture.whenStable().then(() => {
			const tooltip = document.querySelector('.tooltip-container');
			expect(directive['timer']).toBeFalsy();
			expect(tooltip).toBeFalsy();
		});
	}));

	it('should display default tooltip description if none is provided', fakeAsync(() => {
		const directive = testElement[0].injector.get(TooltipDirective) as TooltipDirective

		directive.appTooltip = null;
		directiveParent.dispatchEvent(new MouseEvent('mouseenter'));
		tick(750);
		fixture.detectChanges();

		fixture.whenStable().then(() => {
			const tooltip = document.querySelector('.tooltip-container');
			expect(tooltip.textContent).toBe('No description available.');
		});
	}));

	it('should clear tooltipElement variable in directive on destroy', () => {
		const directive = testElement[0].injector.get(TooltipDirective) as TooltipDirective
		directive.ngOnDestroy();
		expect(directive['tooltipElement']).toBeFalsy();
	});
});
