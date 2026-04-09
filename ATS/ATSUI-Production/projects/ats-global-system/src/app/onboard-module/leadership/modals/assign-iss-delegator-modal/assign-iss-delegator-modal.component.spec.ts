import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignIssDelegatorModalComponent } from './assign-iss-delegator-modal.component';

describe('AssignIssDelegatorModalComponent', () => {
  let component: AssignIssDelegatorModalComponent;
  let fixture: ComponentFixture<AssignIssDelegatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignIssDelegatorModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignIssDelegatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
