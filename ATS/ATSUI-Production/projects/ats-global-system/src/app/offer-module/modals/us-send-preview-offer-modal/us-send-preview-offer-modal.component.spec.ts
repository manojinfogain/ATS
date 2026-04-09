import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsSendPreviewOfferModalComponent } from './us-send-preview-offer-modal.component';

describe('UsSendPreviewOfferModalComponent', () => {
  let component: UsSendPreviewOfferModalComponent;
  let fixture: ComponentFixture<UsSendPreviewOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsSendPreviewOfferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsSendPreviewOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
