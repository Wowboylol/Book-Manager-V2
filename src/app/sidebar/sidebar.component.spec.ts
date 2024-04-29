import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SidebarComponent } from './sidebar.component';
import { routes } from '../app-routing';
import { DataStorageService } from '../shared/services/data-storage.service';
import { BookService } from '../shared/services/book.service';
import { testData } from 'src/test-data/test-data';

describe('SidebarComponent', () => {
	let component: SidebarComponent;
	let fixture: ComponentFixture<SidebarComponent>;
	let mockDataStorageService: jasmine.SpyObj<DataStorageService>;
	let mockBookService: jasmine.SpyObj<BookService>;

	beforeEach(async () => {
		mockDataStorageService = jasmine.createSpyObj('DataStorageService', ['storeData', 'fetchData']);
		mockBookService = jasmine.createSpyObj('BookService', ['getAllBooks']);

		await TestBed.configureTestingModule({
			imports: [SidebarComponent, RouterTestingModule.withRoutes(routes), HttpClientTestingModule],
			providers: [
				{ provide: DataStorageService, useValue: mockDataStorageService },
				{ provide: BookService, useValue: mockBookService }
			]
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

	it('should display confirm save dialog when attempting to store with zero books', () => {
		component.showConfirmSave = false;
		mockBookService.getAllBooks.and.returnValue([]);
		component.onSaveData();
		expect(component.showConfirmSave).toBeTrue();
	});

	it('should set cooldown, save data, and run alert when storing existing data', () => {
		let alertSpy = spyOn(component, 'runAlert');
		component.showConfirmSave = false;
		mockBookService.getAllBooks.and.returnValue(testData.books);
		component.onSaveData();
		expect(component.showConfirmSave).toBeFalse();
		expect(component.dataServiceCooldownTimer).not.toBeNull();
		expect(mockDataStorageService.storeData).toHaveBeenCalled();
		expect(alertSpy).toHaveBeenCalled();
	});

	it('should set cooldown, fetch data, and run alert when fetching data', () => {
		let alertSpy = spyOn(component, 'runAlert');
		component.onFetchData();
		expect(component.dataServiceCooldownTimer).not.toBeNull();
		expect(mockDataStorageService.fetchData).toHaveBeenCalled();
		expect(alertSpy).toHaveBeenCalled();
	});

	it('should display cooldown error when attempting to save or fetch data during cooldown', () => {
		let alertSpy = spyOn(component, 'runAlert');
		component['setDataServiceCooldownTimer']();
		component.onFetchData();
		expect(component.alertMessage).toBe('Please wait 5 seconds before trying again.');
		expect(component.alertType).toBe('danger');
		expect(alertSpy).toHaveBeenCalled();
	});

	it('should store zero books when confirm save dialog is accepted', () => {
		component.showConfirmSave = true;
		mockBookService.getAllBooks.and.returnValue([]);
		component.onSaveData();
		expect(mockDataStorageService.storeData).toHaveBeenCalled();
	});

	it('should unsubscribe from subscriptions when destroyed', () => {
		spyOn(component['themeChangedSubscription'], 'unsubscribe');
		spyOn(component['authSubscription'], 'unsubscribe');
		component.ngOnDestroy();
		expect(component['themeChangedSubscription'].unsubscribe).toHaveBeenCalled();
		expect(component['authSubscription'].unsubscribe).toHaveBeenCalled();
	});

	afterEach(() => {
		fixture.destroy();
	});
});
