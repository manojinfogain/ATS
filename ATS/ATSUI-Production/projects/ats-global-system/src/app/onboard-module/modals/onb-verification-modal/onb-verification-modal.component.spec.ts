import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnbVerificationModalComponent } from './onb-verification-modal.component';

describe('OnbVerificationModalComponent', () => {
  let component: OnbVerificationModalComponent;
  let fixture: ComponentFixture<OnbVerificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnbVerificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnbVerificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
