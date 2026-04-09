import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsHiringTrackerComponent } from './us-hiring-tracker.component';

describe('UsHiringTrackerComponent', () => {
  let component: UsHiringTrackerComponent;
  let fixture: ComponentFixture<UsHiringTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsHiringTrackerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsHiringTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
