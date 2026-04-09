import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtsPdfViewerComponent } from './ats-pdf-viewer.component';

describe('AtsPdfViewerComponent', () => {
  let component: AtsPdfViewerComponent;
  let fixture: ComponentFixture<AtsPdfViewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtsPdfViewerComponent]
    });
    fixture = TestBed.createComponent(AtsPdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
