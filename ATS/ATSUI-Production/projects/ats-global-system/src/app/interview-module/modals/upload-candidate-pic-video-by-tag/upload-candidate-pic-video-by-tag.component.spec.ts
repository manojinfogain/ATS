import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCandidatePicVideoByTagComponent } from './upload-candidate-pic-video-by-tag.component';

describe('UploadCandidatePicVideoByTagComponent', () => {
  let component: UploadCandidatePicVideoByTagComponent;
  let fixture: ComponentFixture<UploadCandidatePicVideoByTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCandidatePicVideoByTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCandidatePicVideoByTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
