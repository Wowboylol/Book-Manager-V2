import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthComponent } from './auth.component';
import { AuthResponseData, AuthService } from '../shared/services/auth.service';

describe('AuthComponent', () => {
	let component: AuthComponent;
	let fixture: ComponentFixture<AuthComponent>;
	let mockAuthService: jasmine.SpyObj<AuthService>;
	let router: Router;
	let authResponseData: AuthResponseData;

	beforeEach(async () => {
		mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'signup']);
		authResponseData = {
			kind: 'identitytoolkit#VerifyPasswordResponse',
			idToken: `abc`,
			email: `test@test.com`,
			refreshToken: `def`,
			expiresIn: `3600`,
			localId: `ghi`,
			registered: true
		};

		await TestBed.configureTestingModule({
			imports: [ AuthComponent, HttpClientTestingModule ],
			providers: [ 
				{ provide: AuthService, useValue: mockAuthService } 
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(AuthComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		fixture.detectChanges();
	});

	it('should create the auth component', () => {
		expect(component).toBeTruthy();
	});

	it('should login the user when in login mode and form is submitted', () => {
		const routerSpy = spyOn(router, 'navigate');
		let emailInput = fixture.nativeElement.querySelector('input[name="email"]');
		let passwordInput = fixture.nativeElement.querySelector('input[name="password"]');
		let submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
		component.isLoginMode = true;

		emailInput.value = 'test@test.com';
		passwordInput.value = 'password';
		emailInput.dispatchEvent(new Event('input'));
		passwordInput.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		mockAuthService.login.and.returnValue(of(authResponseData));

		submitButton.click();
		expect(mockAuthService.login).toHaveBeenCalled();
		expect(routerSpy).toHaveBeenCalled();
	});

	it('should not login user if entered data is invalid', () => {
		const routerSpy = spyOn(router, 'navigate');
		const alertSpy = spyOn<any>(component, 'runAlert');
		let emailInput = fixture.nativeElement.querySelector('input[name="email"]');
		let passwordInput = fixture.nativeElement.querySelector('input[name="password"]');
		let submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
		component.isLoginMode = true;

		emailInput.value = 'invalid@test.com';
		passwordInput.value = 'invalid';
		emailInput.dispatchEvent(new Event('input'));
		passwordInput.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		mockAuthService.login.and.returnValue(throwError(() => new Error('Invalid email or password')));

		submitButton.click();
		expect(mockAuthService.login).toHaveBeenCalled();
		expect(routerSpy).not.toHaveBeenCalled();
		expect(alertSpy).toHaveBeenCalled();
	});

	it('should signup the user when in signup mode and form is submitted', () => {
		component.isLoginMode = false;
		fixture.detectChanges();

		const routerSpy = spyOn(router, 'navigate');

		mockAuthService.signup.and.returnValue(of(authResponseData));

		component.onSubmit({ 
			valid: true, 
			value: { email: 'test@test.com', password: 'password', repassword: 'password' }, 
			reset: () => {} 
		} as any)
		expect(component.isValidConfirmPassword).toBeTrue();
		expect(mockAuthService.signup).toHaveBeenCalled();
		expect(routerSpy).toHaveBeenCalled();
	});

	it('should not signup user if re-entered password does not match password', () => {
		component.isLoginMode = false;
		fixture.detectChanges();

		const routerSpy = spyOn(router, 'navigate');
		
		component.onSubmit({ 
			valid: true, 
			value: { email: 'test@test.com', password: 'password', repassword: 'invalid' }, 
			reset: () => {} 
		} as any)
		expect(component.isValidConfirmPassword).toBeFalse();
		expect(mockAuthService.signup).not.toHaveBeenCalled();
		expect(routerSpy).not.toHaveBeenCalled();
	});
});
