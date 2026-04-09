import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcceptOfferUsModalComponent } from './view-accept-offer-us-modal.component';

describe('ViewAcceptOfferUsModalComponent', () => {
  let component: ViewAcceptOfferUsModalComponent;
  let fixture: ComponentFixture<ViewAcceptOfferUsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAcceptOfferUsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAcceptOfferUsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
