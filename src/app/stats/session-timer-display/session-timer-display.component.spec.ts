import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTimerDisplayComponent } from './session-timer-display.component';

describe('SessionTimerDisplayComponent', () => {
	let component: SessionTimerDisplayComponent;
	let fixture: ComponentFixture<SessionTimerDisplayComponent>;

  	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ SessionTimerDisplayComponent ]
		})
    	.compileComponents();

		fixture = TestBed.createComponent(SessionTimerDisplayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
