import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventBgvScreenModalComponent } from './prevent-bgv-screen-modal.component';

describe('PreventBgvScreenModalComponent', () => {
  let component: PreventBgvScreenModalComponent;
  let fixture: ComponentFixture<PreventBgvScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreventBgvScreenModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventBgvScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
