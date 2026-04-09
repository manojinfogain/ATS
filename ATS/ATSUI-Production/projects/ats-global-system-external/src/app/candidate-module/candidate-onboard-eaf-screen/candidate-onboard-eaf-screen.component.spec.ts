import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOnboardEafScreenComponent } from './candidate-onboard-eaf-screen.component';

describe('CandidateOnboardEafScreenComponent', () => {
  let component: CandidateOnboardEafScreenComponent;
  let fixture: ComponentFixture<CandidateOnboardEafScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateOnboardEafScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateOnboardEafScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
