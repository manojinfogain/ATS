import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentAdditionalSkillControlComponent } from './talent-additional-skill-control.component';

describe('TalentAdditionalSkillControlComponent', () => {
  let component: TalentAdditionalSkillControlComponent;
  let fixture: ComponentFixture<TalentAdditionalSkillControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentAdditionalSkillControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentAdditionalSkillControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
