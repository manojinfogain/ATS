import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BizopsControlComponent } from './bizops-control.component';

describe('BizopsControlComponent', () => {
  let component: BizopsControlComponent;
  let fixture: ComponentFixture<BizopsControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BizopsControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BizopsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
