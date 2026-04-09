import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPdfViewerExternalComponent } from './common-pdf-viewer-external.component';

describe('CommonPdfViewerExternalComponent', () => {
  let component: CommonPdfViewerExternalComponent;
  let fixture: ComponentFixture<CommonPdfViewerExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonPdfViewerExternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPdfViewerExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
