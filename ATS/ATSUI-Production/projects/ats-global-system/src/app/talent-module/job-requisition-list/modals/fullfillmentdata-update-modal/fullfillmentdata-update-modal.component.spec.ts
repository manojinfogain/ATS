import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullfillmentdataUpdateModalComponent } from './fullfillmentdata-update-modal.component';

describe('FullfillmentdataUpdateModalComponent', () => {
  let component: FullfillmentdataUpdateModalComponent;
  let fixture: ComponentFixture<FullfillmentdataUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullfillmentdataUpdateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullfillmentdataUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
