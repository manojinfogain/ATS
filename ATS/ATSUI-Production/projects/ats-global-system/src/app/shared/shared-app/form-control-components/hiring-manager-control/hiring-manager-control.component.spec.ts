import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringManagerControlComponent } from './hiring-manager-control.component';

describe('HiringManagerControlComponent', () => {
  let component: HiringManagerControlComponent;
  let fixture: ComponentFixture<HiringManagerControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringManagerControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringManagerControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
