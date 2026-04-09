import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveTransferedCandidateComponent } from './approve-transfered-candidate.component';

describe('ApproveTransferedCandidateComponent', () => {
  let component: ApproveTransferedCandidateComponent;
  let fixture: ComponentFixture<ApproveTransferedCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveTransferedCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveTransferedCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
