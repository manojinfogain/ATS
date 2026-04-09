import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatejoiningDetailsModalComponent } from './updatejoining-details-modal.component';

describe('UpdatejoiningDetailsModalComponent', () => {
  let component: UpdatejoiningDetailsModalComponent;
  let fixture: ComponentFixture<UpdatejoiningDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatejoiningDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatejoiningDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
