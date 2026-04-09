import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentCubeControlComponent } from './talent-cube-control.component';

describe('TalentCubeControlComponent', () => {
  let component: TalentCubeControlComponent;
  let fixture: ComponentFixture<TalentCubeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentCubeControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentCubeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
