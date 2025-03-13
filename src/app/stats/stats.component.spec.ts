import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsComponent } from './stats.component';
import { HttpClientModule } from '@angular/common/http';

describe('StatsComponent', () => {
	let component: StatsComponent;
	let fixture: ComponentFixture<StatsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ StatsComponent, HttpClientModule ]
		})
		.compileComponents();

		fixture = TestBed.createComponent(StatsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the stats component', () => {
		expect(component).toBeTruthy();
	});
});
