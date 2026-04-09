import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverListUsControlComponent } from './approver-list-us-control.component';

describe('ApproverListUsControlComponent', () => {
  let component: ApproverListUsControlComponent;
  let fixture: ComponentFixture<ApproverListUsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverListUsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverListUsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
