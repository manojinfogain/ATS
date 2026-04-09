import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDetailsScComponent } from './other-details-sc.component';

describe('OtherDetailsScComponent', () => {
  let component: OtherDetailsScComponent;
  let fixture: ComponentFixture<OtherDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherDetailsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
