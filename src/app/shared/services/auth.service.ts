import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from 'src/environments/environment.prod';

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
	constructor(private http: HttpClient) {}

	signup(email: string, password: string): Observable<AuthResponseData> {
		return this.http.post<AuthResponseData>(
			`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`, 
			{
				email: email,
				password: password,
				returnSecureToken: true
			}
		).pipe(catchError(this.handleError));
	}

    login(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError));
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
}
