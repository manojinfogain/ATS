import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateRightsFormModalComponent } from './delegate-rights-form-modal.component';

describe('DelegateRightsFormModalComponent', () => {
  let component: DelegateRightsFormModalComponent;
  let fixture: ComponentFixture<DelegateRightsFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateRightsFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegateRightsFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
