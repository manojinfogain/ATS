import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonForDropModalComponent } from './reason-for-drop-modal.component';

describe('ReasonForDropModalComponent', () => {
  let component: ReasonForDropModalComponent;
  let fixture: ComponentFixture<ReasonForDropModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonForDropModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonForDropModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
