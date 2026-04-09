import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedCandidateTransferModalComponent } from './selected-candidate-transfer-modal.component';

describe('SelectedCandidateTransferModalComponent', () => {
  let component: SelectedCandidateTransferModalComponent;
  let fixture: ComponentFixture<SelectedCandidateTransferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedCandidateTransferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCandidateTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
