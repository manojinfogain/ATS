import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMsgPopupComponent } from './alert-msg-popup.component';

describe('AlertMsgPopupComponent', () => {
  let component: AlertMsgPopupComponent;
  let fixture: ComponentFixture<AlertMsgPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertMsgPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMsgPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
