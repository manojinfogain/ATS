import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferGenScreenModalComponent } from './offer-gen-screen-modal.component';

describe('OfferGenScreenModalComponent', () => {
  let component: OfferGenScreenModalComponent;
  let fixture: ComponentFixture<OfferGenScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferGenScreenModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferGenScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
