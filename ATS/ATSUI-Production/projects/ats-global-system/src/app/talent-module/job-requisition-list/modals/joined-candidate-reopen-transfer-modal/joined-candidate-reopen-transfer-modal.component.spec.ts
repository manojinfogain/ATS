import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedCandidateReopenTransferModalComponent } from './joined-candidate-reopen-transfer-modal.component';

describe('JoinedCandidateReopenTransferModalComponent', () => {
  let component: JoinedCandidateReopenTransferModalComponent;
  let fixture: ComponentFixture<JoinedCandidateReopenTransferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinedCandidateReopenTransferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinedCandidateReopenTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
