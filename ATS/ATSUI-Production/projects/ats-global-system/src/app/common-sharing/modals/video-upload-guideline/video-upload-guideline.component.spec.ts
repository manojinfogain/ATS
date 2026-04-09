import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUploadGuidelineComponent } from './video-upload-guideline.component';

describe('VideoUploadGuidelineComponent', () => {
  let component: VideoUploadGuidelineComponent;
  let fixture: ComponentFixture<VideoUploadGuidelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoUploadGuidelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoUploadGuidelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
