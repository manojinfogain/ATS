import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandProbabiltyViewComponent } from './demand-probabilty-view.component';

describe('DemandProbabiltyViewComponent', () => {
  let component: DemandProbabiltyViewComponent;
  let fixture: ComponentFixture<DemandProbabiltyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandProbabiltyViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandProbabiltyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
