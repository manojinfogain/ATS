import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsPdfViewerExternalComponent } from './ats-pdf-viewer-external.component';

describe('AtsPdfViewerExternalComponent', () => {
  let component: AtsPdfViewerExternalComponent;
  let fixture: ComponentFixture<AtsPdfViewerExternalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtsPdfViewerExternalComponent]
    });
    fixture = TestBed.createComponent(AtsPdfViewerExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
