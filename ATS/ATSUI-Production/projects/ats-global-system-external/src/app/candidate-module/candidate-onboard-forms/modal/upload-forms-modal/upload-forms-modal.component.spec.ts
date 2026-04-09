import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFormsModalComponent } from './upload-forms-modal.component';

describe('UploadFormsModalComponent', () => {
  let component: UploadFormsModalComponent;
  let fixture: ComponentFixture<UploadFormsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFormsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFormsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
