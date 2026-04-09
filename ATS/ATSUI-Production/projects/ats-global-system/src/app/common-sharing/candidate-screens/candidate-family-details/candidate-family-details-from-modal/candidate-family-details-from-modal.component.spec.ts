import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateFamilyDetailsFromModalComponent } from './candidate-family-details-from-modal.component';

describe('CandidateFamilyDetailsFromModalComponent', () => {
  let component: CandidateFamilyDetailsFromModalComponent;
  let fixture: ComponentFixture<CandidateFamilyDetailsFromModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateFamilyDetailsFromModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateFamilyDetailsFromModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
