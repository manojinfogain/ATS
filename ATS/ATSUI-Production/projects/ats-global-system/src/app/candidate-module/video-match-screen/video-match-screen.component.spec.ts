import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoMatchScreenComponent } from './video-match-screen.component';

describe('VideoMatchScreenComponent', () => {
  let component: VideoMatchScreenComponent;
  let fixture: ComponentFixture<VideoMatchScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoMatchScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoMatchScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
