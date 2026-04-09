import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimarySkillsByTcControlComponent } from './primary-skills-by-tc-control.component';

describe('PrimarySkillsByTcControlComponent', () => {
  let component: PrimarySkillsByTcControlComponent;
  let fixture: ComponentFixture<PrimarySkillsByTcControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimarySkillsByTcControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimarySkillsByTcControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
