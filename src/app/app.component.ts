import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from './shared/services/auth.service';

@Component({
	standalone: true,
	imports: [SidebarComponent, RouterModule],
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit
{ 
	constructor(private authService: AuthService) { }

	ngOnInit(): void {
		this.authService.autoLogin();
	}
}
