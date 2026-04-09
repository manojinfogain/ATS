import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JDListModalTcComponent } from './jd-list-modal-tc.component';

describe('JDListModalTcComponent', () => {
  let component: JDListModalTcComponent;
  let fixture: ComponentFixture<JDListModalTcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JDListModalTcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JDListModalTcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
