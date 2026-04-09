import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCandidateModalComponent } from './transfer-candidate-modal.component';

describe('TransferCandidateModalComponent', () => {
  let component: TransferCandidateModalComponent;
  let fixture: ComponentFixture<TransferCandidateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferCandidateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCandidateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
