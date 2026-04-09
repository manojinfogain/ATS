import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgvFinalStatusControlComponent } from './bgv-final-status-control.component';

describe('BgvFinalStatusControlComponent', () => {
  let component: BgvFinalStatusControlComponent;
  let fixture: ComponentFixture<BgvFinalStatusControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgvFinalStatusControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvFinalStatusControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
