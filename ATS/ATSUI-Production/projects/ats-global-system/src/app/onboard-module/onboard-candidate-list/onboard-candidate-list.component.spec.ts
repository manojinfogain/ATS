import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardCandidateListComponent } from './onboard-candidate-list.component';

describe('OnboardCandidateListComponent', () => {
  let component: OnboardCandidateListComponent;
  let fixture: ComponentFixture<OnboardCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardCandidateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
