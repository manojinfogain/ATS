import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParnerStatusFormModalComponent } from './parner-status-form-modal.component';

describe('ParnerStatusFormModalComponent', () => {
  let component: ParnerStatusFormModalComponent;
  let fixture: ComponentFixture<ParnerStatusFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParnerStatusFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParnerStatusFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
