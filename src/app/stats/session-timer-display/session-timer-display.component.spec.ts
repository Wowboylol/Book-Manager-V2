import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { SessionTimerDisplayComponent } from './session-timer-display.component';
import { AuthService, TokenResponseData } from 'src/app/shared/services/auth.service';

describe('SessionTimerDisplayComponent', () => {
	let component: SessionTimerDisplayComponent;
	let fixture: ComponentFixture<SessionTimerDisplayComponent>;
	let mockAuthService: jasmine.SpyObj<AuthService>;
	let tokenResponseData: TokenResponseData;

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
		mockAuthService = jasmine.createSpyObj('AuthService', ['refreshSession']);
		spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
		spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
		spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
		spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

		// Set mock data
		mockLocalStorage.setItem('user-data', JSON.stringify({ _tokenExpirationDate: new Date(Date.now() + 3600000) }));
		tokenResponseData = {
			expires_in: '3600000',
			token_type: 'Bearer',
			refresh_token: 'def',
			id_token: 'test_id_token',
			user_id: 'abc',
			project_id: '123'
		};

		await TestBed.configureTestingModule({
			imports: [ SessionTimerDisplayComponent ],
			providers: [
				{ provide: AuthService, useValue: mockAuthService }
			]
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
		localStorage.setItem('user-data', JSON.stringify({ _tokenExpirationDate: new Date(Date.now() + 1883900) }));
		let sessionDisplayElement = fixture.nativeElement.querySelector('strong');
		fixture.detectChanges();
		clearInterval(component["sessionUpdateInterval"]);
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

	it('should not refresh session when remaining session time is greater than 45 minutes', () => {
		localStorage.setItem('user-data', JSON.stringify({ _tokenExpirationDate: new Date(Date.now() + 3600000) }));
		fixture.detectChanges();
		component.refreshSession();
		expect(mockAuthService.refreshSession).not.toHaveBeenCalled();
	});

	it('should refresh session and update expiration time stamp when remaining session time is less than 45 minutes', () => {
		let mockExpirationDate = new Date(Date.now() + 2695000);
		localStorage.setItem('user-data', JSON.stringify({ _tokenExpirationDate: mockExpirationDate }));
		mockAuthService.refreshSession.and.returnValue(of(tokenResponseData));
		fixture.detectChanges();
		component.refreshSession();
		expect(mockAuthService.refreshSession).toHaveBeenCalled();
		expect(component["expirationTimestamp"]).toBe(mockExpirationDate.getTime());
	});

	it('should display error alert when refresh session fails', () => {
		localStorage.setItem('user-data', JSON.stringify({ _tokenExpirationDate: new Date(Date.now() + 1234567) }));
		mockAuthService.refreshSession.and.returnValue(throwError(() => new Error('Invalid refresh token, please login again!')));
		fixture.detectChanges();
		component.refreshSession();
		expect(component.alertToggle).toBe('show');
		expect(component.alertType).toBe('danger');
	});
});
