import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibConfirmationDialogComponent } from './lib-confirmation-dialog.component';

describe('LibConfirmationDialogComponent', () => {
  let component: LibConfirmationDialogComponent;
  let fixture: ComponentFixture<LibConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
