import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllTechAiAssesmentComponent } from './view-all-tech-ai-assesment.component';

describe('ViewAllTechAiAssesmentComponent', () => {
  let component: ViewAllTechAiAssesmentComponent;
  let fixture: ComponentFixture<ViewAllTechAiAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAllTechAiAssesmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllTechAiAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
