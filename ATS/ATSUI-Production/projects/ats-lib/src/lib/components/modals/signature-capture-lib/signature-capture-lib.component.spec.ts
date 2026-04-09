import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureCaptureLibComponent } from './signature-capture-lib.component';

describe('SignatureCaptureLibComponent', () => {
  let component: SignatureCaptureLibComponent;
  let fixture: ComponentFixture<SignatureCaptureLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureCaptureLibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureCaptureLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
