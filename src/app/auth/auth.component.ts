import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { AuthService } from '../shared/services/auth.service';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
	selector: 'app-auth',
	standalone: true,
	imports: [CommonModule, FormsModule, LoadingSpinnerComponent, AlertComponent],
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit 
{
	// Auth data
	showPassword: boolean = false;
	isLoginMode: boolean = true;
	isValidConfirmPassword: boolean = true;
	isLoading: boolean = false;

	// Alert data
	alertToggle: string = 'hidden';
	errorMessage: string = null;

	constructor(private authService: AuthService) { }

	ngOnInit(): void {}

	// Runs when the form is submitted
	onSubmit(form: NgForm) {
		if(!form.valid) { return; }
		const email = form.value.email;
		const password = form.value.password;

		if(this.isLoginMode) {
			this.isLoading = true;
			// TODO: Login
			this.isLoading = false;
		}
		else {
			if(!this.validateConfirmPassword(form)) { return; }
			this.isLoading = true;
			this.authService.signup(email, password).subscribe({
				next: response => {
					console.log(response);
				},
				error: errorMessage => {
					console.error(errorMessage);
					this.errorMessage = errorMessage;
					this.runAlert();
				}
			});
			this.isLoading = false;
		}
		form.reset();
	}

	// Checks if the confirm password is same as password
	private validateConfirmPassword(form: NgForm): boolean {
		if(form.value.password !== form.value.repassword) {
			this.isValidConfirmPassword = false;
			return false;
		}
		this.isValidConfirmPassword = true;
		return true;
	}

	// Runs the alert component animation
	private runAlert(): void {
		if(this.alertToggle === 'hidden')
		{
			this.alertToggle = 'show';
			setTimeout(() => {
				this.alertToggle = 'hidden';
			}, 3000);			
		}
	}
}
