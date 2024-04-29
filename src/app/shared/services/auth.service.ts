import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

import { environment } from 'src/environments/environment.prod';
import { User } from '../models/user.model';

export interface AuthResponseData
{
	kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService 
{
    private tokenExpirationTimer: any;
    user = new BehaviorSubject<User>(null);

	constructor(private http: HttpClient, private router: Router) {}

    // Signup user and redirect to home page
	signup(email: string, password: string): Observable<AuthResponseData> {
		return this.http.post<AuthResponseData>(
			`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, 
			{
				email: email,
				password: password,
				returnSecureToken: true
			}
		).pipe(
            catchError(this.handleError), 
            tap(res => {
                this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn);
            })
        );
	}

    // Login user and redirect to home page
    login(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(res => {
                this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn);
            })
        );
    }

    // Logout user by clearing user data and redirect to auth page
    logout(): void {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('user-data');

        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
        location.reload();
    }

    // Auto login user if token is still valid and page is refreshed
    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('user-data'));

        if(!userData) { 
            return; 
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if(loadedUser.token) {
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.user.next(loadedUser);
            this.autoLogout(expirationDuration);
        }
    }

    // Auto logout user when token expires
    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    // Handle error response from firebase api
	private handleError(errorRes: HttpErrorResponse)
    {
        let errorMessage = new Error('An unknown error occurred!');
        if(!errorRes.error || !errorRes.error.error) { 
			return throwError(() => errorMessage);
		}

        switch(errorRes.error.error.message){
            case "EMAIL_EXISTS":
                errorMessage = new Error("This email already exists!");
                break;
            case "INVALID_LOGIN_CREDENTIALS":
                errorMessage = new Error("The email or password is incorrect!");
                break;
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
                errorMessage = new Error("Too many attempts, try again later!");
                break;
        }
        return throwError(() => errorMessage);
    }

    // Handle user authentication and save user data to local storage
    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('user-data', JSON.stringify(user));
    }
}
