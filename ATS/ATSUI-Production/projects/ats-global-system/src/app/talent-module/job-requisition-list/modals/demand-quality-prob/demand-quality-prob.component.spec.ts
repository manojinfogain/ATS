import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandQualityProbComponent } from './demand-quality-prob.component';

describe('DemandQualityProbComponent', () => {
  let component: DemandQualityProbComponent;
  let fixture: ComponentFixture<DemandQualityProbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandQualityProbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandQualityProbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
