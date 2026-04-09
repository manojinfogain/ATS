import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeadershipModalComponent } from './add-leadership-modal.component';

describe('AddLeadershipModalComponent', () => {
  let component: AddLeadershipModalComponent;
  let fixture: ComponentFixture<AddLeadershipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLeadershipModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeadershipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
