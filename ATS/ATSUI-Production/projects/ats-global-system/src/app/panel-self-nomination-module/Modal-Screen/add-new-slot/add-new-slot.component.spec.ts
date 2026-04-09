import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSlotComponent } from './add-new-slot.component';

describe('AddNewSlotComponent', () => {
  let component: AddNewSlotComponent;
  let fixture: ComponentFixture<AddNewSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewSlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
