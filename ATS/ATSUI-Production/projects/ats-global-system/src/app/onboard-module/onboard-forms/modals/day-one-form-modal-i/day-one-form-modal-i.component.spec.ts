import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOneFormModalIComponent } from './day-one-form-modal-i.component';

describe('DayOneFormModalIComponent', () => {
  let component: DayOneFormModalIComponent;
  let fixture: ComponentFixture<DayOneFormModalIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayOneFormModalIComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOneFormModalIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
