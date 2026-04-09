import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferGenerationConfirmationModalComponent } from './offer-generation-confirmation-modal.component';

describe('OfferGenerationConfirmationModalComponent', () => {
  let component: OfferGenerationConfirmationModalComponent;
  let fixture: ComponentFixture<OfferGenerationConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferGenerationConfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferGenerationConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
