import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingOfferdCandidateComponent } from './adding-offerd-candidate.component';

describe('AddingOfferdCandidateComponent', () => {
  let component: AddingOfferdCandidateComponent;
  let fixture: ComponentFixture<AddingOfferdCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingOfferdCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingOfferdCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
