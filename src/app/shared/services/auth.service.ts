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

export interface TokenResponseData
{
    expires_in: string;
    token_type: string;
    refresh_token: string;
    id_token: string;
    user_id: string;
    project_id: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService 
{
    private tokenExpirationTimer: any;
    private reloadWindow: any;
    user = new BehaviorSubject<User>(null);

	constructor(private http: HttpClient, private router: Router) {
        this.reloadWindow = window; // Used to provide window override in tests
    }

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
                this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn, res.refreshToken);
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
                this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn, res.refreshToken);
            })
        );
    }

    // Refresh user session by getting new token with refresh token
    refreshSession(refreshToken: string): Observable<TokenResponseData> {
        return this.http.post<TokenResponseData>(
            `https://securetoken.googleapis.com/v1/token?key=${environment.firebaseApiKey}`,
            {
                grant_type: "refresh_token",
                refresh_token: refreshToken
            }
        ).pipe(
            catchError(this.handleError),
            tap(res => {
                this.handleAuthentication(null, res.user_id, res.id_token, +res.expires_in, res.refresh_token);
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
        this.reloadWindow.location.reload();
    }

    // Auto login user if token is still valid and page is refreshed
    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
            _refreshToken: string;
        } = JSON.parse(localStorage.getItem('user-data'));

        if(!userData) { 
            return; 
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate), userData._refreshToken);
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
            case "INVALID_REFRESH_TOKEN":
                errorMessage = new Error("Invalid refresh token, please login again!");
                break;
        }
        return throwError(() => errorMessage);
    }

    // Handle user authentication and save user data to local storage
    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number, refreshToken: string) 
    {
        // If email is null (when refreshing token), use email from local storage
        if(!email) {
            email = JSON.parse(localStorage.getItem('user-data')).email;
        }
        
        // If token expiration timer exists, clear it
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }

        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate, refreshToken);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('user-data', JSON.stringify(user));
    }
}
