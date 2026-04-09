import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadItineraryDocumentComponent } from './upload-itinerary-document.component';

describe('UploadItineraryDocumentComponent', () => {
  let component: UploadItineraryDocumentComponent;
  let fixture: ComponentFixture<UploadItineraryDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadItineraryDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadItineraryDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
