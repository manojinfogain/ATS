import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelListCtrlComponent } from './panel-list-ctrl.component';

describe('PanelListCtrlComponent', () => {
  let component: PanelListCtrlComponent;
  let fixture: ComponentFixture<PanelListCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelListCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelListCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
