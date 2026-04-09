import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReferbackMailModalComponent } from './confirm-referback-mail-modal.component';

describe('ConfirmReferbackMailModalComponent', () => {
  let component: ConfirmReferbackMailModalComponent;
  let fixture: ComponentFixture<ConfirmReferbackMailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmReferbackMailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmReferbackMailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
