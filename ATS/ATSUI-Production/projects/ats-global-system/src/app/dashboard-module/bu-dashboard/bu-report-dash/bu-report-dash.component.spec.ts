import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuReportDashComponent } from './bu-report-dash.component';

describe('BuReportDashComponent', () => {
  let component: BuReportDashComponent;
  let fixture: ComponentFixture<BuReportDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuReportDashComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuReportDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
