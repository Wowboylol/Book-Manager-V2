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

	it('should have dark mode off by default', () => {
		expect(service.isDarkMode()).toBeFalse();
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
});
