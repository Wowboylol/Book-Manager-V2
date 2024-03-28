import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
	let component: AlertComponent;
	let fixture: ComponentFixture<AlertComponent>;
	let alertElement: HTMLElement;
	let messageElement: HTMLElement;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ AlertComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(AlertComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		// Get HTML elements
		alertElement = fixture.nativeElement.querySelector("#alert-box");
		messageElement = fixture.nativeElement.querySelector("#alert-text");
	});

	it('should create alert component', () => {
		expect(component).toBeTruthy();
	});

	it('should display message', () => {
		component.message = 'Test message';
		fixture.detectChanges();
		expect(messageElement.textContent).toBe('Test message');
	});

	it('should be able to display all alert types', () => {
		let alertTypes: string[] = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark'];
		alertTypes.forEach((type: string) => {
			component.type = type;
			fixture.detectChanges();
			expect(alertElement.classList.contains(`alert-${type}`)).toBe(true);
		});
	});
});
