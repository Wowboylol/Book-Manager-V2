import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-auth',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit 
{
	constructor() { }
	ngOnInit(): void {}
}
