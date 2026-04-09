import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibUploadDocModalComponent } from './lib-upload-doc-modal.component';

describe('UploadDocModalComponent', () => {
  let component: LibUploadDocModalComponent;
  let fixture: ComponentFixture<LibUploadDocModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibUploadDocModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibUploadDocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
