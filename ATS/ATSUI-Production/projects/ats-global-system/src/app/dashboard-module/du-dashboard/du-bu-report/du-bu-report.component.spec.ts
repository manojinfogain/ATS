import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuBuReportComponent } from './du-bu-report.component';

describe('DuBuReportComponent', () => {
  let component: DuBuReportComponent;
  let fixture: ComponentFixture<DuBuReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuBuReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuBuReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
