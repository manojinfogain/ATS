import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddupdatePanelScreenComponent } from './addupdate-panel-screen.component';

describe('AddupdatePanelScreenComponent', () => {
  let component: AddupdatePanelScreenComponent;
  let fixture: ComponentFixture<AddupdatePanelScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddupdatePanelScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddupdatePanelScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
