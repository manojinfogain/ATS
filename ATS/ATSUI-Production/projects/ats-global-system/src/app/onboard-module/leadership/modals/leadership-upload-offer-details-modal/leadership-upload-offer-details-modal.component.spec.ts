import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadershipUploadOfferDetailsModalComponent } from './leadership-upload-offer-details-modal.component';

describe('LeadershipUploadOfferDetailsModalComponent', () => {
  let component: LeadershipUploadOfferDetailsModalComponent;
  let fixture: ComponentFixture<LeadershipUploadOfferDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadershipUploadOfferDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadershipUploadOfferDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
