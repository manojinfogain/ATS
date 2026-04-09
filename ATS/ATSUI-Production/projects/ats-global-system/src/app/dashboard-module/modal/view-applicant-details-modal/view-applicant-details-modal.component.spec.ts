import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApplicantDetailsModalComponent } from './view-applicant-details-modal.component';

describe('ViewApplicantDetailsModalComponent', () => {
  let component: ViewApplicantDetailsModalComponent;
  let fixture: ComponentFixture<ViewApplicantDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewApplicantDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApplicantDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
