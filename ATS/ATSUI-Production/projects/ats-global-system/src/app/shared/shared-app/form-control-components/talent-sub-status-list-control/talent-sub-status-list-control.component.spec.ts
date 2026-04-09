import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentSubStatusListControlComponent } from './talent-sub-status-list-control.component';

describe('TalentSubStatusListControlComponent', () => {
  let component: TalentSubStatusListControlComponent;
  let fixture: ComponentFixture<TalentSubStatusListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentSubStatusListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentSubStatusListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
