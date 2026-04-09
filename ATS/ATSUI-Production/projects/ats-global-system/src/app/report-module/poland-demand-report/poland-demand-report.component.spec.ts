import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolandDemandReportComponent } from './poland-demand-report.component';

describe('PolandDemandReportComponent', () => {
  let component: PolandDemandReportComponent;
  let fixture: ComponentFixture<PolandDemandReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolandDemandReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolandDemandReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
