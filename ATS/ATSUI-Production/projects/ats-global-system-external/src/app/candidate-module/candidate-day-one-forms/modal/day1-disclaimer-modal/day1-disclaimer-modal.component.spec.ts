import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Day1DisclaimerModalComponent } from './day1-disclaimer-modal.component';

describe('Day1DisclaimerModalComponent', () => {
  let component: Day1DisclaimerModalComponent;
  let fixture: ComponentFixture<Day1DisclaimerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Day1DisclaimerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Day1DisclaimerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
