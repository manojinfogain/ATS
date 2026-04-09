import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeEmployyeeModalComponent } from './propose-employyee-modal.component';

describe('ProposeEmployyeeModalComponent', () => {
  let component: ProposeEmployyeeModalComponent;
  let fixture: ComponentFixture<ProposeEmployyeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposeEmployyeeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposeEmployyeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
