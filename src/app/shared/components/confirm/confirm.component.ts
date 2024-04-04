import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-confirm',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit 
{
	@Input() title: string;
	@Input() message: string;
	@Input() confirmText?: string = 'Confirm';

	constructor() { }
	ngOnInit(): void { }
}
