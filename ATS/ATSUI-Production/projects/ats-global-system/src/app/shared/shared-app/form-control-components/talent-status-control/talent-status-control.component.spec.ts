import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentStatusControlComponent } from './talent-status-control.component';

describe('TalentStatusControlComponent', () => {
  let component: TalentStatusControlComponent;
  let fixture: ComponentFixture<TalentStatusControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentStatusControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentStatusControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
