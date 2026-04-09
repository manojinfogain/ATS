import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IjpStatusControlComponent } from './ijp-status-control.component';

describe('IjpStatusControlComponent', () => {
  let component: IjpStatusControlComponent;
  let fixture: ComponentFixture<IjpStatusControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IjpStatusControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IjpStatusControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
