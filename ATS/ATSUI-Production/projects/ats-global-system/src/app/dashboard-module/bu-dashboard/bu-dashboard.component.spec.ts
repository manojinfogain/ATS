import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuDashboardComponent } from './bu-dashboard.component';

describe('BuDashboardComponent', () => {
  let component: BuDashboardComponent;
  let fixture: ComponentFixture<BuDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
