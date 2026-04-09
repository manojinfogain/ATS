import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPdfViewerInternalComponent } from './common-pdf-viewer-internal.component';

describe('CommonPdfViewerInternalComponent', () => {
  let component: CommonPdfViewerInternalComponent;
  let fixture: ComponentFixture<CommonPdfViewerInternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonPdfViewerInternalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPdfViewerInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
