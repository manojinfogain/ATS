import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferApproveActionModalComponent } from './offer-approve-action-modal.component';

describe('OfferApproveActionModalComponent', () => {
  let component: OfferApproveActionModalComponent;
  let fixture: ComponentFixture<OfferApproveActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferApproveActionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferApproveActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
