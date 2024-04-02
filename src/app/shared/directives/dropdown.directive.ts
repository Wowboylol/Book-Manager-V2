import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
	selector: '[appDropdown]',
	standalone: true
})
export class DropdownDirective 
{
	@HostBinding('class.show') isOpen = false;
	
	@HostListener('click') toggleOpen() {
		this.isOpen = !this.isOpen;
	}
}
