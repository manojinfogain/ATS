import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoMatchOnboardAlertComponent } from './video-match-onboard-alert.component';

describe('VideoMatchOnboardAlertComponent', () => {
  let component: VideoMatchOnboardAlertComponent;
  let fixture: ComponentFixture<VideoMatchOnboardAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoMatchOnboardAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoMatchOnboardAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
