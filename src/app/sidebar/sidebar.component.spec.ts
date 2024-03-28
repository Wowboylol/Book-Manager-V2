import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
	let component: SidebarComponent;
	let fixture: ComponentFixture<SidebarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SidebarComponent],
		})
		.compileComponents();

		fixture = TestBed.createComponent(SidebarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the sidebar', () => {
		expect(component).toBeTruthy();
	});

	it('should be closed by default', () => {
		expect(component.close).toBeTrue();
	});

	it('should have current active tab set to "Books" by default', () => {
		expect(component.currentActiveTab).toBe('Books');
	});

	it('should open sidebar when hamburger menu is clicked', () => {
		component.toggleSidebar();
		expect(component.close).toBeFalse();
	});

	it('should set mode to dark mode from light mode when switch is toggled', () => {
		component.darkMode = false;
		component.toggleMode();
		expect(component.darkMode).toBeTrue();
	});

	it('should set mode to light mode from dark mode when switch is toggled', () => {
		component.darkMode = true;
		component.toggleMode();
		expect(component.darkMode).toBeFalse();
	});

	it('should set mode text to "Light Mode" from "Dark Mode" when switch is toggled', () => {
		component.darkMode = false;
		component.toggleMode();
		expect(component.modeText).toBe('Light Mode');
	});

	it('should set mode text to "Dark Mode" from "Light Mode" when switch is toggled', () => {
		component.darkMode = true;
		component.toggleMode();
		expect(component.modeText).toBe('Dark Mode');
	});

	it('should change active tab when a tab is clicked', () => {
		component.changeActiveTab('Collections');
		expect(component.currentActiveTab).toBe('Collections');
	});

	afterEach(() => {
		fixture.destroy();
	});
});
