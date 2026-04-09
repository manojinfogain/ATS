import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControModalComponent } from './form-contro-modal.component';

describe('FormControModalComponent', () => {
  let component: FormControModalComponent;
  let fixture: ComponentFixture<FormControModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormControModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormControModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
