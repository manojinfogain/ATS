import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmWisReportComponent } from './pm-wis-report.component';

describe('PmWisReportComponent', () => {
  let component: PmWisReportComponent;
  let fixture: ComponentFixture<PmWisReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmWisReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmWisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
