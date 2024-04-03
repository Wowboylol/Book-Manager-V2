import { Directive, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[appDropdown]',
	standalone: true
})
export class DropdownDirective 
{
	@Input() dropdownMenu: HTMLElement;

	@HostListener('click') toggleOpen() {
		this.dropdownMenu.classList.toggle('show');
	}
}
