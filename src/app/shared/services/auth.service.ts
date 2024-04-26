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
    user = new BehaviorSubject<User>(null);

	constructor(private http: HttpClient, private router: Router) {}

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

    logout(): void {
        this.user.next(null);
        this.router.navigate(['/auth']);
    }

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

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
    }
}
