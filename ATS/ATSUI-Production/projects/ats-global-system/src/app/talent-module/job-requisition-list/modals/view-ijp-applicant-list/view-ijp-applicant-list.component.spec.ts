import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewIjpApplicantListComponent } from './view-ijp-applicant-list.component';

describe('ViewIjpApplicantListComponent', () => {
  let component: ViewIjpApplicantListComponent;
  let fixture: ComponentFixture<ViewIjpApplicantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewIjpApplicantListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIjpApplicantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
