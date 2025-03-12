import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTimerDisplayComponent } from './session-timer-display.component';

describe('SessionTimerDisplayComponent', () => {
	let component: SessionTimerDisplayComponent;
	let fixture: ComponentFixture<SessionTimerDisplayComponent>;

  	beforeEach(async () => {
		let store = {};
		const mockLocalStorage = {
			getItem: (key: string): string => {
				return key in store ? store[key] : null;
			},
			setItem: (key: string, value: string) => {
				store[key] = `${value}`;
			},
			removeItem: (key: string) => {
				delete store[key];
			},
			clear: () => {
				store = {};
			}
		};
		spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
		spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
		spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
		spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

		// Set mock token expiration date to one hour from now
		mockLocalStorage.setItem('user-data', JSON.stringify({ _tokenExpirationDate: new Date(Date.now() + 3600000) }));

		await TestBed.configureTestingModule({
			imports: [ SessionTimerDisplayComponent ]
		})
    	.compileComponents();

		fixture = TestBed.createComponent(SessionTimerDisplayComponent);
		component = fixture.componentInstance;
	});

	it('should create the session timer display', () => {
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('should update session time display to 31:23 when JSON is set', () => {
		localStorage.setItem('user-data', JSON.stringify({ _tokenExpirationDate: new Date(Date.now() + 1883000) }));
		let sessionDisplayElement = fixture.nativeElement.querySelector('strong');
		fixture.detectChanges();
		expect(component.remainingSessionTime).toBeGreaterThan(0);
		expect(sessionDisplayElement.textContent).toBe('31:23');
	});

	it('should clear session update interval on destroy', () => {
		fixture.detectChanges();
		const spy = spyOn(window, 'clearInterval');
		component.ngOnDestroy();
		expect(spy).toHaveBeenCalled();
	});

	it('should not update session time display when user data is invalid', () => {
		localStorage.setItem('user-data', 'invalid');
		fixture.detectChanges();
		component.ngOnInit();
		expect(component.remainingSessionTime).toBe(0);
	});
});
