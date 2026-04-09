import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCandidateDetailsPartnerComponent } from './update-candidate-details-partner.component';

describe('UpdateCandidateDetailsPartnerComponent', () => {
  let component: UpdateCandidateDetailsPartnerComponent;
  let fixture: ComponentFixture<UpdateCandidateDetailsPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCandidateDetailsPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCandidateDetailsPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
