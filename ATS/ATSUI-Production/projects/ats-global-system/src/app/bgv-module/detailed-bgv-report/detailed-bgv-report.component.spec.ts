import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedBgvReportComponent } from './detailed-bgv-report.component';

describe('DetailedBgvReportComponent', () => {
  let component: DetailedBgvReportComponent;
  let fixture: ComponentFixture<DetailedBgvReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedBgvReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedBgvReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
