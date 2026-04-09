import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualOfferAcceptIndModalComponent } from './manual-offer-accept-ind-modal.component';

describe('ManualOfferAcceptIndModalComponent', () => {
  let component: ManualOfferAcceptIndModalComponent;
  let fixture: ComponentFixture<ManualOfferAcceptIndModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualOfferAcceptIndModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualOfferAcceptIndModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
