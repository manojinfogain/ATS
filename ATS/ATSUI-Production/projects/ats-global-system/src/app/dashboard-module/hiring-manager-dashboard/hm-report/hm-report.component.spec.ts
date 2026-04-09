import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmReportComponent } from './hm-report.component';

describe('HmReportComponent', () => {
  let component: HmReportComponent;
  let fixture: ComponentFixture<HmReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
