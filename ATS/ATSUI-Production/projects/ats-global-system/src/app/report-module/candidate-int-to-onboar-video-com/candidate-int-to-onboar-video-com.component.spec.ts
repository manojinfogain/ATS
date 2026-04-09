import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateIntToOnboarVideoComComponent } from './candidate-int-to-onboar-video-com.component';

describe('CandidateIntToOnboarVideoComComponent', () => {
  let component: CandidateIntToOnboarVideoComComponent;
  let fixture: ComponentFixture<CandidateIntToOnboarVideoComComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateIntToOnboarVideoComComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateIntToOnboarVideoComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
