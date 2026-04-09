import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelListScreenComponent } from './panel-list-screen.component';

describe('PanelListScreenComponent', () => {
  let component: PanelListScreenComponent;
  let fixture: ComponentFixture<PanelListScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelListScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelListScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
