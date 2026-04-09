import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferScreenComponent } from './offer-screen.component';

describe('OfferScreenComponent', () => {
  let component: OfferScreenComponent;
  let fixture: ComponentFixture<OfferScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfferScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
