import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IjpReportWmgComponent } from './ijp-report-wmg.component';

describe('IjpReportWmgComponent', () => {
  let component: IjpReportWmgComponent;
  let fixture: ComponentFixture<IjpReportWmgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IjpReportWmgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IjpReportWmgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
