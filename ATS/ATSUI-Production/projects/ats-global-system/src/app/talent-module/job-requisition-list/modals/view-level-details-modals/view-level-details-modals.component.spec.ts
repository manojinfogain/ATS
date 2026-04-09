import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLevelDetailsModalsComponent } from './view-level-details-modals.component';

describe('ViewLevelDetailsModalsComponent', () => {
  let component: ViewLevelDetailsModalsComponent;
  let fixture: ComponentFixture<ViewLevelDetailsModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewLevelDetailsModalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLevelDetailsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
