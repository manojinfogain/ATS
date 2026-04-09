import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalDbCheckDetailsComponent } from './global-db-check-details.component';

describe('GlobalDbCheckDetailsComponent', () => {
  let component: GlobalDbCheckDetailsComponent;
  let fixture: ComponentFixture<GlobalDbCheckDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalDbCheckDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalDbCheckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
