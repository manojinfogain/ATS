import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOlAcceptanceDocModalComponent } from './upload-ol-acceptance-doc-modal.component';

describe('UploadOlAcceptanceDocModalComponent', () => {
  let component: UploadOlAcceptanceDocModalComponent;
  let fixture: ComponentFixture<UploadOlAcceptanceDocModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadOlAcceptanceDocModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOlAcceptanceDocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
