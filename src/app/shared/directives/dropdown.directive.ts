import { Directive, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[appDropdown]',
	standalone: true
})
export class DropdownDirective 
{
	@Input() appDropdown: HTMLElement;

	@HostListener('click') toggleOpen() {
		this.appDropdown.classList.toggle('show');
	}
}
