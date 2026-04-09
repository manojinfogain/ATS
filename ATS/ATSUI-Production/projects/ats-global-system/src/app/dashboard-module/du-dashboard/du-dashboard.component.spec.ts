import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuDashboardComponent } from './du-dashboard.component';

describe('DuDashboardComponent', () => {
  let component: DuDashboardComponent;
  let fixture: ComponentFixture<DuDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
