import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenRejectModalComponent } from './screen-reject-modal.component';

describe('ScreenRejectModalComponent', () => {
  let component: ScreenRejectModalComponent;
  let fixture: ComponentFixture<ScreenRejectModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenRejectModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenRejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
