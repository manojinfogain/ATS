import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibViewInstructionModalComponent } from './lib-view-instruction-modal.component';

describe('ViewInstructionModalComponent', () => {
  let component: LibViewInstructionModalComponent;
  let fixture: ComponentFixture<LibViewInstructionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibViewInstructionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibViewInstructionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
