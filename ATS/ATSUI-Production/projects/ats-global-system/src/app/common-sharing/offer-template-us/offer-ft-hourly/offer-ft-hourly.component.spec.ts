import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFTHourlyComponent } from './offer-ft-hourly.component';

describe('OfferFTHourlyComponent', () => {
  let component: OfferFTHourlyComponent;
  let fixture: ComponentFixture<OfferFTHourlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferFTHourlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferFTHourlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
