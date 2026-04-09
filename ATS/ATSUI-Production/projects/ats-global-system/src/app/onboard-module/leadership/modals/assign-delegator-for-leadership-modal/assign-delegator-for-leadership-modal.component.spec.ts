import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDelegatorForLeadershipModalComponent } from './assign-delegator-for-leadership-modal.component';

describe('AssignDelegatorForLeadershipModalComponent', () => {
  let component: AssignDelegatorForLeadershipModalComponent;
  let fixture: ComponentFixture<AssignDelegatorForLeadershipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignDelegatorForLeadershipModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignDelegatorForLeadershipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
