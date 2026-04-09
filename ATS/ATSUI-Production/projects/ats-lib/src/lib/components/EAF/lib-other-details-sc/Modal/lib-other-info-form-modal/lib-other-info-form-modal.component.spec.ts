import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibOtherInfoFormModalComponent } from './lib-other-info-form-modal.component';

describe('OtherInfoFormModalComponent', () => {
  let component: LibOtherInfoFormModalComponent;
  let fixture: ComponentFixture<LibOtherInfoFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibOtherInfoFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibOtherInfoFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
