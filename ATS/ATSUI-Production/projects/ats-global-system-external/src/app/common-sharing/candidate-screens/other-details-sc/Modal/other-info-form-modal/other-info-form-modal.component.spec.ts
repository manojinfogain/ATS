import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInfoFormModalComponent } from './other-info-form-modal.component';

describe('OtherInfoFormModalComponent', () => {
  let component: OtherInfoFormModalComponent;
  let fixture: ComponentFixture<OtherInfoFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherInfoFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherInfoFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
