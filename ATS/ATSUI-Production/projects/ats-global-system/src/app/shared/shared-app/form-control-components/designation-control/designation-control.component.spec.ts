import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationControlComponent } from './designation-control.component';

describe('DesignationControlComponent', () => {
  let component: DesignationControlComponent;
  let fixture: ComponentFixture<DesignationControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
