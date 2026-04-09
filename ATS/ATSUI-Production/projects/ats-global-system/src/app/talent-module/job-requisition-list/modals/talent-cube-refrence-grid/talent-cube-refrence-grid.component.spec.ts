import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentCubeRefrenceGridComponent } from './talent-cube-refrence-grid.component';

describe('TalentCubeRefrenceGridComponent', () => {
  let component: TalentCubeRefrenceGridComponent;
  let fixture: ComponentFixture<TalentCubeRefrenceGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalentCubeRefrenceGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentCubeRefrenceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
