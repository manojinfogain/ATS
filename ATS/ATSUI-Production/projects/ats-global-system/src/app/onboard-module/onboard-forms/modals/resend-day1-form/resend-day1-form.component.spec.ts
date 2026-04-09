import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendDay1FormComponent } from './resend-day1-form.component';

describe('ResendDay1FormComponent', () => {
  let component: ResendDay1FormComponent;
  let fixture: ComponentFixture<ResendDay1FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResendDay1FormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendDay1FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
