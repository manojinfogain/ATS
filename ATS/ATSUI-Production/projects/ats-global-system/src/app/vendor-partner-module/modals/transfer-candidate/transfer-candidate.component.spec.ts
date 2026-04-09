import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCandidateComponent } from './transfer-candidate.component';

describe('TransferCandidateComponent', () => {
  let component: TransferCandidateComponent;
  let fixture: ComponentFixture<TransferCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
