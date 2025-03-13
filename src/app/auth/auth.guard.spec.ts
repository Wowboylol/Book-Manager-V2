import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/models/user.model';

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let router: Router;
	let mockAuthService: jasmine.SpyObj<AuthService>;

	beforeEach(() => {
		const userMock = new BehaviorSubject<User>(null);
		mockAuthService = jasmine.createSpyObj('AuthService', {
			user: userMock.asObservable()
		});

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				{ provide: AuthService, useValue: mockAuthService }
			]
		});
		guard = TestBed.inject(AuthGuard);
		router = TestBed.inject(Router);
	});

	it('should create auth guard', () => {
		expect(guard).toBeTruthy();
	});

	it('should return true for a user that is authenticated', () => {
		mockAuthService.user = new BehaviorSubject<User>(new User('test@test.com', 'abc', 'def', new Date(), 'efg'));
		const userObservable: Observable<boolean> = guard.canActivate(null, null) as Observable<boolean>;
		userObservable.subscribe(isAuth => {
			expect(isAuth).toBeTrue();
		});
	});

	it('should return a UrlTree for a user that is not authenticated', () => {
		mockAuthService.user = new BehaviorSubject<User>(null);
		const userObservable: Observable<UrlTree> = guard.canActivate(null, null) as Observable<UrlTree>;
		userObservable.subscribe(isAuth => {
			expect(isAuth).toEqual(router.createUrlTree(['/auth']));
		});
	});
});
