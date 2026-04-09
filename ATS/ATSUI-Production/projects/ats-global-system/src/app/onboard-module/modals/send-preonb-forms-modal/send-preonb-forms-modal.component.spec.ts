import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPreonbFormsModalComponent } from './send-preonb-forms-modal.component';

describe('SendPreonbFormsModalComponent', () => {
  let component: SendPreonbFormsModalComponent;
  let fixture: ComponentFixture<SendPreonbFormsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPreonbFormsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPreonbFormsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
