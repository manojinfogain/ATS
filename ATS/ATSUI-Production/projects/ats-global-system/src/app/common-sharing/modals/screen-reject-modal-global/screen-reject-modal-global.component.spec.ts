import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenRejectModalGlobalComponent } from './screen-reject-modal-global.component';

describe('ScreenRejectModalGlobalComponent', () => {
  let component: ScreenRejectModalGlobalComponent;
  let fixture: ComponentFixture<ScreenRejectModalGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenRejectModalGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenRejectModalGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
