import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReferedEmpModalComponent } from './view-refered-emp-modal.component';

describe('ViewReferedEmpModalComponent', () => {
  let component: ViewReferedEmpModalComponent;
  let fixture: ComponentFixture<ViewReferedEmpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReferedEmpModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReferedEmpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
