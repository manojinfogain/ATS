import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInstructionModalComponent } from './view-instruction-modal.component';

describe('ViewInstructionModalComponent', () => {
  let component: ViewInstructionModalComponent;
  let fixture: ComponentFixture<ViewInstructionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInstructionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInstructionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
