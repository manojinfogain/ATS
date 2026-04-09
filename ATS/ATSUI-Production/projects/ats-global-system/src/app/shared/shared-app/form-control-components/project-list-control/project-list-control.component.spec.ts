import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListControlComponent } from './project-list-control.component';

describe('ProjectListControlComponent', () => {
  let component: ProjectListControlComponent;
  let fixture: ComponentFixture<ProjectListControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectListControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
