import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileImgViewComponent } from './file-img-view.component';

describe('FileImgViewComponent', () => {
  let component: FileImgViewComponent;
  let fixture: ComponentFixture<FileImgViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileImgViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileImgViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
