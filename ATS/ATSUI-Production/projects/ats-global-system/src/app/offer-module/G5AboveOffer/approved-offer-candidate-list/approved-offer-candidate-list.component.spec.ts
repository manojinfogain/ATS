import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedOfferCandidateListComponent } from './approved-offer-candidate-list.component';

describe('ApprovedOfferCandidateListComponent', () => {
  let component: ApprovedOfferCandidateListComponent;
  let fixture: ComponentFixture<ApprovedOfferCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedOfferCandidateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedOfferCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
