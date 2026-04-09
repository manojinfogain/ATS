import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInterviewerModalComponent } from './update-interviewer-modal.component';

describe('UpdateInterviewerModalComponent', () => {
  let component: UpdateInterviewerModalComponent;
  let fixture: ComponentFixture<UpdateInterviewerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateInterviewerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInterviewerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
