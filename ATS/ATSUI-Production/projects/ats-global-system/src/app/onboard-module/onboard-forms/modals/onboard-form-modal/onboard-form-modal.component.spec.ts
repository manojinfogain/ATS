import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardFormModalComponent } from './onboard-form-modal.component';

describe('OnboardFormModalComponent', () => {
  let component: OnboardFormModalComponent;
  let fixture: ComponentFixture<OnboardFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
