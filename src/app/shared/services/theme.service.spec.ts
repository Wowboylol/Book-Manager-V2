import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  	let service: ThemeService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ThemeService);
	});

	it('should create the theme service', () => {
		expect(service).toBeTruthy();
	});

	it('setDarkMode(true) should turn dark mode on', () => {
		service.setDarkMode(true);
		expect(service.isDarkMode()).toBeTrue();
	});

	it('setDarkMode(false) should turn dark mode off', () => {
		service.setDarkMode(false);
		expect(service.isDarkMode()).toBeFalse();
	});

	it('setDarkMode(true) should add dark-mode class to body', () => {
		service.setDarkMode(true);
		expect(document.body.classList.contains('dark-mode')).toBeTrue();
	});

	it('setDarkMode(false) should remove dark-mode class from body', () => {
		service.setDarkMode(false);
		expect(document.body.classList.contains('dark-mode')).toBeFalse();
	});

	it('setDarkMode(true) should emit true to themeChanged', () => {
		let spy = spyOn(service.themeChanged, 'next');
		service.setDarkMode(true);
		expect(spy).toHaveBeenCalledWith(true);
	});

	it('setDarkMode(false) should emit false to themeChanged', () => {
		let spy = spyOn(service.themeChanged, 'next');
		service.setDarkMode(false);
		expect(spy).toHaveBeenCalledWith(false);
	});

	it('setDarkMode(true) should save dark mode preference to local storage', () => {
		service.setDarkMode(true);
		expect(localStorage.getItem('dark-mode')).toBe('true');
	});

	it('setDarkMode(false) should save light mode preference to local storage', () => {
		service.setDarkMode(false);
		expect(localStorage.getItem('dark-mode')).toBe('false');
	});

	it('should load dark mode preference from local storage', () => {
		localStorage.setItem('dark-mode', 'true');
		service = new ThemeService();
		expect(service.isDarkMode()).toBeTrue();
	});

	it('should load light mode preference from local storage', () => {
		localStorage.setItem('dark-mode', 'false');
		service = new ThemeService();
		expect(service.isDarkMode()).toBeFalse();
	});

	it('should load light mode preference from local storage if no preference is set', () => {
		localStorage.removeItem('dark-mode');
		service = new ThemeService();
		expect(service.isDarkMode()).toBeFalse();
	});
});
