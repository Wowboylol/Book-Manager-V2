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
});
