import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyApplicationDetailsModalComponent } from './my-application-details-modal.component';

describe('MyApplicationDetailsModalComponent', () => {
  let component: MyApplicationDetailsModalComponent;
  let fixture: ComponentFixture<MyApplicationDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyApplicationDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApplicationDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
