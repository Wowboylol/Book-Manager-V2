import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmComponent } from './confirm.component';

describe('ConfirmComponent', () => {
	let component: ConfirmComponent;
	let fixture: ComponentFixture<ConfirmComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ ConfirmComponent ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(ConfirmComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
  	});

	it('should create confirm component', () => {
		expect(component).toBeTruthy();
	});

	it('should emit cancel event when cancel buttons are clicked', () => {
		let cancelSpy = spyOn(component.cancel, 'emit');
		let cancelButton = fixture.nativeElement.querySelector(".btn-secondary");
		let XButton = fixture.nativeElement.querySelector(".btn-close");
		cancelButton.click();
		XButton.click();
		expect(cancelSpy).toHaveBeenCalledTimes(2);
	});

	it('should emit confirm event when confirm button is clicked', () => {
		let confirmSpy = spyOn(component.confirm, 'emit');
		let confirmButton = fixture.nativeElement.querySelector(".btn-danger");
		confirmButton.click();
		expect(confirmSpy).toHaveBeenCalledTimes(1);
	});

	it('should display title, message, and confirm button text', () => {
		component.title = 'Test title';
		component.message = 'Test message';
		component.confirmText = 'Test confirm';
		fixture.detectChanges();
		let titleElement = fixture.nativeElement.querySelector(".confirm-title");
		let messageElement = fixture.nativeElement.querySelector(".confirm-message");
		let confirmButton = fixture.nativeElement.querySelector(".btn-danger");
		expect(titleElement.textContent).toBe('Test title');
		expect(messageElement.textContent).toBe('Test message');
		expect(confirmButton.textContent).toBe('Test confirm');
	});
});
