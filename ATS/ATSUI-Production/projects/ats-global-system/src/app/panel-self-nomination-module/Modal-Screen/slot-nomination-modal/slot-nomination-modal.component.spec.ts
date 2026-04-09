import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotNominationModalComponent } from './slot-nomination-modal.component';

describe('SlotNominationModalComponent', () => {
  let component: SlotNominationModalComponent;
  let fixture: ComponentFixture<SlotNominationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotNominationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotNominationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
