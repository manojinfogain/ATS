import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPreviewOfferModalComponent } from './send-preview-offer-modal.component';

describe('SendPreviewOfferModalComponent', () => {
  let component: SendPreviewOfferModalComponent;
  let fixture: ComponentFixture<SendPreviewOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPreviewOfferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPreviewOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
