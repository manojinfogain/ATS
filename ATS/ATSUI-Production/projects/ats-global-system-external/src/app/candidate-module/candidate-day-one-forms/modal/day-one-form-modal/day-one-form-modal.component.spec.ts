import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOneFormModalComponent } from './day-one-form-modal.component';

describe('DayOneFormModalComponent', () => {
  let component: DayOneFormModalComponent;
  let fixture: ComponentFixture<DayOneFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayOneFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayOneFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
