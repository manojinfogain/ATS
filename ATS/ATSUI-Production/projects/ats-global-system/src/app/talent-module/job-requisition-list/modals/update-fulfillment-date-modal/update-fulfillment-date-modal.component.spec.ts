import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFulfillmentDateModalComponent } from './update-fulfillment-date-modal.component';

describe('UpdateFulfillmentDateModalComponent', () => {
  let component: UpdateFulfillmentDateModalComponent;
  let fixture: ComponentFixture<UpdateFulfillmentDateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFulfillmentDateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFulfillmentDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
