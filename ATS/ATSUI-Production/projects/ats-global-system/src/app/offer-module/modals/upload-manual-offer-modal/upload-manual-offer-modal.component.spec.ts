import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadManualOfferModalComponent } from './upload-manual-offer-modal.component';

describe('UploadManualOfferModalComponent', () => {
  let component: UploadManualOfferModalComponent;
  let fixture: ComponentFixture<UploadManualOfferModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadManualOfferModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadManualOfferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
