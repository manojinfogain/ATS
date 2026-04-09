import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProfileFormComponent } from './upload-profile-form.component';

describe('UploadProfileFormComponent', () => {
  let component: UploadProfileFormComponent;
  let fixture: ComponentFixture<UploadProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadProfileFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
