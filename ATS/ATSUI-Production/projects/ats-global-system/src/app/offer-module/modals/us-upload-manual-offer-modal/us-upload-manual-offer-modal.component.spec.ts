import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsUploadManualOfferModalComponent } from './us-upload-manual-offer-modal.component';

describe('UsUploadManualOfferModalComponent', () => {
  let component: UsUploadManualOfferModalComponent;
  let fixture: ComponentFixture<UsUploadManualOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsUploadManualOfferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsUploadManualOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
