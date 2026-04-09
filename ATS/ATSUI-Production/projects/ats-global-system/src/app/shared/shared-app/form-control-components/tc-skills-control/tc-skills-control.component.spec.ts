import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcSkillsControlComponent } from './tc-skills-control.component';

describe('TcSkillsControlComponent', () => {
  let component: TcSkillsControlComponent;
  let fixture: ComponentFixture<TcSkillsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TcSkillsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TcSkillsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
