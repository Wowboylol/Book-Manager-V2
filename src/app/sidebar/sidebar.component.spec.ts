import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SidebarComponent } from './sidebar.component';
import { routes } from '../app-routing';

describe('SidebarComponent', () => {
	let component: SidebarComponent;
	let fixture: ComponentFixture<SidebarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SidebarComponent, RouterTestingModule.withRoutes(routes)],
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

	it('should set mode to dark mode from light mode when switch is toggled', () => {
		component.darkMode = false;
		component.toggleMode();
		expect(component.darkMode).toBeTrue();
		expect(component.modeText).toBe('Light Mode');
	});

	it('should set mode to light mode from dark mode when switch is toggled', () => {
		component.darkMode = true;
		component.toggleMode();
		expect(component.darkMode).toBeFalse();
		expect(component.modeText).toBe('Dark Mode');
	});

	it('should set isMobile to true when screen width is resized to 767px', () => {
		component.onScreenResize({ target: { innerWidth: 767 }});
		expect(component.isMobile).toBeTrue();
		const onScreenResizeSpy = spyOn(component, 'onScreenResize');
		window.dispatchEvent(new Event('resize'));
		expect(onScreenResizeSpy).toHaveBeenCalled();
	});

	afterEach(() => {
		fixture.destroy();
	});
});
