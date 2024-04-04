import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-confirm',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent 
{
	@Input() title: string;
	@Input() message: string;
	@Input() confirmText?: string = 'Confirm';
	@Output() cancel = new EventEmitter<void>();
	@Output() confirm = new EventEmitter<void>();

	constructor() { }

	onCancel(): void {
		this.cancel.emit();
	}

	onConfirm(): void {
		this.confirm.emit();
	}
}
