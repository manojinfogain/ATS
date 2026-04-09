import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOfferApprovalDetailsComponent } from './view-offer-approval-details.component';

describe('ViewOfferApprovalDetailsComponent', () => {
  let component: ViewOfferApprovalDetailsComponent;
  let fixture: ComponentFixture<ViewOfferApprovalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOfferApprovalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOfferApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
