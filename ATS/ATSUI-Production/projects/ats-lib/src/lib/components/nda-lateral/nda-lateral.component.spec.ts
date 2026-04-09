import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NDALateralComponent } from './nda-lateral.component';

describe('NDALateralComponent', () => {
  let component: NDALateralComponent;
  let fixture: ComponentFixture<NDALateralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NDALateralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NDALateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
