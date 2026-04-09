import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyApplicationsDashboardComponent } from './my-applications-dashboard.component';

describe('MyApplicationsDashboardComponent', () => {
  let component: MyApplicationsDashboardComponent;
  let fixture: ComponentFixture<MyApplicationsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyApplicationsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApplicationsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
