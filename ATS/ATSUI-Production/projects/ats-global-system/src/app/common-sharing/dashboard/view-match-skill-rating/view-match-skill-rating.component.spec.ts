import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMatchSkillRatingComponent } from './view-match-skill-rating.component';

describe('ViewMatchSkillRatingComponent', () => {
  let component: ViewMatchSkillRatingComponent;
  let fixture: ComponentFixture<ViewMatchSkillRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMatchSkillRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMatchSkillRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
