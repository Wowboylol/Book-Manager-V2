import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownDirective } from './dropdown.directive';

@Component({
	standalone: true,
	template: `
		<div>
			<button [appDropdown]="dropdown">Dropdown</button>
			<div class="dropdown-menu" #dropdown>
				<a href="#" class="dropdown-item">Action</a>
				<a href="#" class="dropdown-item">Another action</a>
				<a href="#" class="dropdown-item">Something else here</a>
			</div>
		</div>`,
	imports: [DropdownDirective]
})
class MockComponent {}

describe('DropdownDirective', () => {
	let fixture: ComponentFixture<MockComponent>;
	let dropdownToggle: HTMLElement;
	let dropdownMenu: HTMLElement;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [DropdownDirective, MockComponent]
		})
		.createComponent(MockComponent);

		fixture.detectChanges();
		dropdownToggle = fixture.nativeElement.querySelector('button');
		dropdownMenu = fixture.nativeElement.querySelector('.dropdown-menu');
	});

	it('should create an instance of dropdown directive', () => {
		const directive = new DropdownDirective();
		expect(directive).toBeTruthy();
	});

	it('should add class "show" to dropdown menu when dropdown button is clicked', () => {
		dropdownToggle.click();
		expect(dropdownMenu.classList).toContain('show');
	});

	it('should remove class "show" from dropdown menu if it exists', () => {
		dropdownMenu.classList.add('show');
		dropdownToggle.click();
		expect(dropdownMenu.classList).not.toContain('show');
	});
});
