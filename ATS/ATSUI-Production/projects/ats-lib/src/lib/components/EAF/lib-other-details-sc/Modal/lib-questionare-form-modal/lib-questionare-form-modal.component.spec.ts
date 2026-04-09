import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibQuestionareFormModalComponent } from './lib-questionare-form-modal.component';

describe('LibQuestionareFormModalComponent', () => {
  let component: LibQuestionareFormModalComponent;
  let fixture: ComponentFixture<LibQuestionareFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibQuestionareFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LibQuestionareFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
