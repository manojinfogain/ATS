import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApproverDailogComponent } from './add-approver-dailog.component';

describe('AddApproverDailogComponent', () => {
  let component: AddApproverDailogComponent;
  let fixture: ComponentFixture<AddApproverDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApproverDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApproverDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
