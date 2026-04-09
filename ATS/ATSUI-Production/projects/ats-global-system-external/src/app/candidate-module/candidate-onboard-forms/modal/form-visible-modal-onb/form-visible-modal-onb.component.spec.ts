import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVisibleModalOnbComponent } from './form-visible-modal-onb.component';

describe('FormVisibleModalOnbComponent', () => {
  let component: FormVisibleModalOnbComponent;
  let fixture: ComponentFixture<FormVisibleModalOnbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormVisibleModalOnbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormVisibleModalOnbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
