import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMediaFileModalComponent } from './preview-media-file-modal.component';

describe('PreviewMediaFileModalComponent', () => {
  let component: PreviewMediaFileModalComponent;
  let fixture: ComponentFixture<PreviewMediaFileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMediaFileModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMediaFileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
