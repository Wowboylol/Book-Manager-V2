import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OverlayComponent } from './overlay.component';
import { routes } from 'src/app/app-routing';

describe('OverlayComponent', () => {
	let component: OverlayComponent;
	let fixture: ComponentFixture<OverlayComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ OverlayComponent, RouterTestingModule.withRoutes(routes) ]
		})
    	.compileComponents();

		fixture = TestBed.createComponent(OverlayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
  	});

	it('should create overlay component', () => {
		expect(component).toBeTruthy();
	});

	it('should set overlay title based on displayed component', () => {
		const displayedComponent = { overlayTitle: 'Test Title' };
		component.updateOverlayTitle(displayedComponent);
		expect(component.overlayTitle).toEqual('Test Title');
	});

	it('should set overflow hidden on body element on init', () => {
		const rendererSpy = spyOn(component["renderer"], 'setStyle');
		component.ngOnInit();
		expect(rendererSpy).toHaveBeenCalledWith(component["document"].body, 'overflow', 'hidden');
	});

	it('should remove overflow hidden on body element on destroy', () => {
		const rendererSpy = spyOn(component["renderer"], 'removeStyle');
		component.ngOnDestroy();
		expect(rendererSpy).toHaveBeenCalledWith(component["document"].body, 'overflow');
	});
});
