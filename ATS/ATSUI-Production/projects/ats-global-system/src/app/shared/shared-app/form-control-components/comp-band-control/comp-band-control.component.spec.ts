import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompBandControlComponent } from './comp-band-control.component';

describe('CompBandControlComponent', () => {
  let component: CompBandControlComponent;
  let fixture: ComponentFixture<CompBandControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompBandControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompBandControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
