import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedCandidateTransferWithTcModalComponent } from './selected-candidate-transfer-with-tc-modal.component';

describe('SelectedCandidateTransferWithTcModalComponent', () => {
  let component: SelectedCandidateTransferWithTcModalComponent;
  let fixture: ComponentFixture<SelectedCandidateTransferWithTcModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedCandidateTransferWithTcModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedCandidateTransferWithTcModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
