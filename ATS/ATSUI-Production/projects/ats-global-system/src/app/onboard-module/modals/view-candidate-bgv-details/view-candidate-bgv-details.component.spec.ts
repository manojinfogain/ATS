import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidateBgvDetailsComponent } from './view-candidate-bgv-details.component';

describe('ViewCandidateBgvDetailsComponent', () => {
  let component: ViewCandidateBgvDetailsComponent;
  let fixture: ComponentFixture<ViewCandidateBgvDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCandidateBgvDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCandidateBgvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
