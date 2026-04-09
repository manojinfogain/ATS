import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingSendCredConfirmationDialogComponent } from './onboarding-send-cred-confirmation-dialog.component';

describe('OnboardingSendCredConfirmationDialogComponent', () => {
  let component: OnboardingSendCredConfirmationDialogComponent;
  let fixture: ComponentFixture<OnboardingSendCredConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingSendCredConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingSendCredConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
