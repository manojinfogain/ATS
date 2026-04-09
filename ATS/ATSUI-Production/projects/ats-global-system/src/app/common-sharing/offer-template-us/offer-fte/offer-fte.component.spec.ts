import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFTEComponent } from './offer-fte.component';

describe('OfferFTEComponent', () => {
  let component: OfferFTEComponent;
  let fixture: ComponentFixture<OfferFTEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferFTEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferFTEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
