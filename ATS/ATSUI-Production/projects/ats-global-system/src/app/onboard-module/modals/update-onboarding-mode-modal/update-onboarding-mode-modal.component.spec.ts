import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOnboardingModeModalComponent } from './update-onboarding-mode-modal.component';

describe('UpdateOnboardingModeModalComponent', () => {
  let component: UpdateOnboardingModeModalComponent;
  let fixture: ComponentFixture<UpdateOnboardingModeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOnboardingModeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOnboardingModeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
