import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCandidateJoiningStatusComponent } from './update-candidate-joining-status.component';

describe('UpdateCandidateJoiningStatusComponent', () => {
  let component: UpdateCandidateJoiningStatusComponent;
  let fixture: ComponentFixture<UpdateCandidateJoiningStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCandidateJoiningStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCandidateJoiningStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
