import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcceptOfferIndModalComponent } from './view-accept-offer-ind-modal.component';

describe('ViewAcceptOfferIndModalComponent', () => {
  let component: ViewAcceptOfferIndModalComponent;
  let fixture: ComponentFixture<ViewAcceptOfferIndModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAcceptOfferIndModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAcceptOfferIndModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
