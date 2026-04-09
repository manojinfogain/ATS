import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferBackMailToCandidateModalComponent } from './refer-back-mail-to-candidate-modal.component';

describe('ReferBackMailToCandidateModalComponent', () => {
  let component: ReferBackMailToCandidateModalComponent;
  let fixture: ComponentFixture<ReferBackMailToCandidateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferBackMailToCandidateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferBackMailToCandidateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
