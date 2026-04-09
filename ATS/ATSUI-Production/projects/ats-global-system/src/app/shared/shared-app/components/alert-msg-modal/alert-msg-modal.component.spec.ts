import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMsgModalComponent } from './alert-msg-modal.component';

describe('AlertMsgModalComponent', () => {
  let component: AlertMsgModalComponent;
  let fixture: ComponentFixture<AlertMsgModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertMsgModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMsgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
