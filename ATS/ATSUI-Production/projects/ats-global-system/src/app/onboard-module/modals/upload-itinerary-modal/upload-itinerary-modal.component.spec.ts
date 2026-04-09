import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadItineraryModalComponent } from './upload-itinerary-modal.component';

describe('UploadItineraryModalComponent', () => {
  let component: UploadItineraryModalComponent;
  let fixture: ComponentFixture<UploadItineraryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadItineraryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadItineraryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
