import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadershipHiringListComponent } from './leadership-hiring-list.component';

describe('LeadershipHiringListComponent', () => {
  let component: LeadershipHiringListComponent;
  let fixture: ComponentFixture<LeadershipHiringListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadershipHiringListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadershipHiringListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
