import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferReasonForDropComponent } from './offer-reason-for-drop.component';

describe('OfferReasonForDropComponent', () => {
  let component: OfferReasonForDropComponent;
  let fixture: ComponentFixture<OfferReasonForDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferReasonForDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferReasonForDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
