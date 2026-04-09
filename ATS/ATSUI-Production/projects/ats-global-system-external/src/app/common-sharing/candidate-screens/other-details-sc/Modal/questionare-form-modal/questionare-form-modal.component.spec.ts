import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionareFormModalComponent } from './questionare-form-modal.component';

describe('QuestionareFormModalComponent', () => {
  let component: QuestionareFormModalComponent;
  let fixture: ComponentFixture<QuestionareFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionareFormModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionareFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
