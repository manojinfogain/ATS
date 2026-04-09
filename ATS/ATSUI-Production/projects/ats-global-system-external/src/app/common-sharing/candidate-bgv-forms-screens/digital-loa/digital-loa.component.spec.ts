import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalLoaComponent } from './digital-loa.component';

describe('DigitalLoaComponent', () => {
  let component: DigitalLoaComponent;
  let fixture: ComponentFixture<DigitalLoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DigitalLoaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalLoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
