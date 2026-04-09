import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLeadershipStatusModalComponent } from './update-leadership-status-modal.component';

describe('UpdateLeadershipStatusModalComponent', () => {
  let component: UpdateLeadershipStatusModalComponent;
  let fixture: ComponentFixture<UpdateLeadershipStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLeadershipStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLeadershipStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
