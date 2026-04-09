import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCalenderHistoryComponent } from './view-calender-history.component';

describe('ViewCalenderHistoryComponent', () => {
  let component: ViewCalenderHistoryComponent;
  let fixture: ComponentFixture<ViewCalenderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCalenderHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCalenderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
