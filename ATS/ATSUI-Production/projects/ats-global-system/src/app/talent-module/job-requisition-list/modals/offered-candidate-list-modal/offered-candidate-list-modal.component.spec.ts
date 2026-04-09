import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferedCandidateListModalComponent } from './offered-candidate-list-modal.component';

describe('OfferedCandidateListModalComponent', () => {
  let component: OfferedCandidateListModalComponent;
  let fixture: ComponentFixture<OfferedCandidateListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferedCandidateListModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedCandidateListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
