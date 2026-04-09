import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsSendOfferToHrModalComponent } from './us-send-offer-to-hr-modal.component';

describe('UsSendOfferToHrModalComponent', () => {
  let component: UsSendOfferToHrModalComponent;
  let fixture: ComponentFixture<UsSendOfferToHrModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsSendOfferToHrModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsSendOfferToHrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
