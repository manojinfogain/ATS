import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperMopComponent } from './image-cropper-mop.component';

describe('ImageCropperMopComponent', () => {
  let component: ImageCropperMopComponent;
  let fixture: ComponentFixture<ImageCropperMopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCropperMopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperMopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
