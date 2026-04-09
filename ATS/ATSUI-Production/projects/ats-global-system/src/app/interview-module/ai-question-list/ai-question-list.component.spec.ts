import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiQuestionListComponent } from './ai-question-list.component';

describe('AiQuestionListComponent', () => {
  let component: AiQuestionListComponent;
  let fixture: ComponentFixture<AiQuestionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiQuestionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AiQuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
