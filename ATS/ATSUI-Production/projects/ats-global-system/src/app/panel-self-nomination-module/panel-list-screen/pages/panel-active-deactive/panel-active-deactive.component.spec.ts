import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelActiveDeactiveComponent } from './panel-active-deactive.component';

describe('PanelActiveDeactiveComponent', () => {
  let component: PanelActiveDeactiveComponent;
  let fixture: ComponentFixture<PanelActiveDeactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelActiveDeactiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelActiveDeactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
