import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidateDetailsPartnerComponent } from './view-candidate-details-partner.component';

describe('ViewCandidateDetailsPartnerComponent', () => {
  let component: ViewCandidateDetailsPartnerComponent;
  let fixture: ComponentFixture<ViewCandidateDetailsPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCandidateDetailsPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCandidateDetailsPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
