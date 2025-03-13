import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthResponseData, AuthService, TokenResponseData } from './auth.service';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
	let service: AuthService;
	let controller: HttpTestingController;

	beforeEach(() => {
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

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AuthService]
		});
		service = TestBed.inject(AuthService);
		controller = TestBed.inject(HttpTestingController);
		
		service['reloadWindow'] = {
			location: {
				reload: () => {}
			}
		};
	});

	it('should signup user', () => {
		let actualResponse: AuthResponseData | undefined;
		const handleAuthenticationSpy = spyOn<any>(service, 'handleAuthentication');

		service.signup('test@test.com', '123').subscribe(
			res => {
				actualResponse = res;
			}
		);
		const request = controller.expectOne(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`);
		request.flush({ email: 'test@test.com', localId: '123', idToken: 'abc', expiresIn: '3600', refreshToken: 'def' });
		controller.verify();

		expect(actualResponse.email).toBe('test@test.com');
		expect(actualResponse.localId).toBe('123');
		expect(actualResponse.idToken).toBe('abc');
		expect(actualResponse.expiresIn).toBe('3600');
		expect(actualResponse.refreshToken).toBe('def');
		expect(handleAuthenticationSpy).toHaveBeenCalledWith('test@test.com', '123', 'abc', 3600, 'def');
	});

	it('should display error message when signup fails', () => {
		let actualError: HttpErrorResponse | undefined;
		service.signup('test@test.com', '123').subscribe({
			next: () => { 
				fail('Signup should have failed!'); 
			},
			error: error => { 
				actualError = error; 
			}
		});

		const expectedUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
		controller.expectOne(expectedUrl).error(
			new ErrorEvent('An unknown error occurred!'),
			{ status: 500, statusText: 'Internal Server Error' }
		);
		expect(actualError).toBeTruthy();
	});
	
	it('should login user', () => {
		let actualResponse: AuthResponseData | undefined;
		const handleAuthenticationSpy = spyOn<any>(service, 'handleAuthentication');

		service.login('test@test.com', '123').subscribe(
			res => {
				actualResponse = res;
			}
		);

		const request = controller.expectOne(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`);
		request.flush({ email: 'test@test.com', localId: '123', idToken: 'abc', expiresIn: '3600', refreshToken: 'def' });
		controller.verify();

		expect(actualResponse.email).toBe('test@test.com');
		expect(actualResponse.localId).toBe('123');
		expect(actualResponse.idToken).toBe('abc');
		expect(actualResponse.expiresIn).toBe('3600');
		expect(actualResponse.refreshToken).toBe('def');
		expect(handleAuthenticationSpy).toHaveBeenCalledWith('test@test.com', '123', 'abc', 3600, 'def');
	});

	it('should display error message when login fails', () => {
		let actualError: HttpErrorResponse | undefined;
		service.login('test@test.com', '123').subscribe({
			next: () => { 
				fail('Login should have failed!'); 
			},
			error: error => { 
				actualError = error; 
			}
		});

		const expectedUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;
		controller.expectOne(expectedUrl).error(
			new ErrorEvent('An unknown error occurred!'),
			{ status: 500, statusText: 'Internal Server Error' }
		);
		expect(actualError).toBeTruthy();
	});

	it('should refresh session', () => {
		let actualResponse: TokenResponseData | undefined;
		const handleAuthenticationSpy = spyOn<any>(service, 'handleAuthentication');

		service.refreshSession('def').subscribe(
			res => {
				actualResponse = res;
			}
		);

		const request = controller.expectOne(`https://securetoken.googleapis.com/v1/token?key=${environment.firebaseApiKey}`);
		request.flush({ 
			expires_in: '3600', 
			token_type: 'Bearer', 
			refresh_token: 'def', 
			id_token: 'abc', 
			user_id: '123', 
			project_id: 'test' 
		});
		controller.verify();

		expect(actualResponse.expires_in).toBe('3600');
		expect(actualResponse.token_type).toBe('Bearer');
		expect(actualResponse.refresh_token).toBe('def');
		expect(actualResponse.id_token).toBe('abc');
		expect(actualResponse.user_id).toBe('123');
		expect(actualResponse.project_id).toBe('test');
		expect(handleAuthenticationSpy).toHaveBeenCalledWith(null, '123', 'abc', 3600, 'def');
	});

	it('should display error message when refresh session fails', () => {
		let actualError: HttpErrorResponse | undefined;
		service.refreshSession('def').subscribe({
			next: () => { 
				fail('Refresh session should have failed!'); 
			},
			error: error => { 
				actualError = error; 
			}
		});

		const expectedUrl = `https://securetoken.googleapis.com/v1/token?key=${environment.firebaseApiKey}`;
		controller.expectOne(expectedUrl).error(
			new ErrorEvent('An unknown error occurred!'),
			{ status: 500, statusText: 'Internal Server Error' }
		);
		expect(actualError).toBeTruthy();
	});

	it('should logout user', () => {
		const navigateSpy = spyOn(service['router'], 'navigate');
		service.logout();
		expect(service.user.value).toBeNull();
		expect(navigateSpy).toHaveBeenCalledWith(['/auth']);
		expect(localStorage.getItem('user-data')).toBeNull();
		expect(service['tokenExpirationTimer']).toBeNull();
	});

	it('should auto login user', () => {
		let tomorrowDate = new Date();
		tomorrowDate.setDate(tomorrowDate.getDate() + 1);
		const userData = {
			email: 'test@test.com',
			id: '123',
			_token: 'abc',
			_tokenExpirationDate: tomorrowDate.toISOString(),
			_refreshToken: 'def'
		};
		localStorage.setItem('user-data', JSON.stringify(userData));

		const autoLogoutSpy = spyOn(service, 'autoLogout');
		service.autoLogin();
		expect(service.user.value.email).toBe('test@test.com');
		expect(service.user.value.id).toBe('123');
		expect(autoLogoutSpy).toHaveBeenCalled();
	});

	it('should not auto login user if user data is not found', () => {
		localStorage.removeItem('user-data');
		const autoLogoutSpy = spyOn(service, 'autoLogout');
		service.autoLogin();
		expect(service.user.value).toBeNull();
		expect(autoLogoutSpy).not.toHaveBeenCalled();
	});

	it('should auto logout user', fakeAsync(() => {
		const logoutSpy = spyOn(service, 'logout');
		service.autoLogout(1000);
		tick(1000);
		expect(logoutSpy).toHaveBeenCalled();
	}));

	it('should handle authentication', () => {
		const autoLogoutSpy = spyOn(service, 'autoLogout');
		service['handleAuthentication']('test@test.com', '123', 'abc', 3600, 'def');
		expect(service.user.value.email).toBe('test@test.com');
		expect(service.user.value.id).toBe('123');
		expect(service.user.value.token).toBe('abc');
		expect(service.user.value.refreshToken).toBe('def');
		expect(autoLogoutSpy).toHaveBeenCalledWith(3600 * 1000);
	});

	it('should handle authentication when email is null', () => {
		const autoLogoutSpy = spyOn(service, 'autoLogout')
		localStorage.setItem('user-data', JSON.stringify({ email: 'test-email@test.com' }));
		service['handleAuthentication'](null, '123', 'abc', 3600, 'def');
		expect(service.user.value.email).toBe('test-email@test.com');
		expect(service.user.value.id).toBe('123');
		expect(service.user.value.token).toBe('abc');
		expect(service.user.value.refreshToken).toBe('def');
		expect(autoLogoutSpy).toHaveBeenCalledWith(3600 * 1000);
	});
});
