import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferStatusControlComponent } from './offer-status-control.component';

describe('OfferStatusControlComponent', () => {
  let component: OfferStatusControlComponent;
  let fixture: ComponentFixture<OfferStatusControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferStatusControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferStatusControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
