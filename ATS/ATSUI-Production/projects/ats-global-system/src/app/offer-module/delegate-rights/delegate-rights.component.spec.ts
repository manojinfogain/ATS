import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegateRightsComponent } from './delegate-rights.component';

describe('DelegateRightsComponent', () => {
  let component: DelegateRightsComponent;
  let fixture: ComponentFixture<DelegateRightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegateRightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegateRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
