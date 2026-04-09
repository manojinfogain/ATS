import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmIfBgSubmittedComponent } from './confirm-if-bg-submitted.component';

describe('ConfirmIfBgSubmittedComponent', () => {
  let component: ConfirmIfBgSubmittedComponent;
  let fixture: ComponentFixture<ConfirmIfBgSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmIfBgSubmittedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmIfBgSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
