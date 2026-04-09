import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoComparisonConsnetModalComponent } from './video-comparison-consnet-modal.component';

describe('VideoComparisonConsnetModalComponent', () => {
  let component: VideoComparisonConsnetModalComponent;
  let fixture: ComponentFixture<VideoComparisonConsnetModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoComparisonConsnetModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoComparisonConsnetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
