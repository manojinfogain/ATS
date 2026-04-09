import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteralAvailableResourceModalComponent } from './interal-available-resource-modal.component';

describe('InteralAvailableResourceModalComponent', () => {
  let component: InteralAvailableResourceModalComponent;
  let fixture: ComponentFixture<InteralAvailableResourceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteralAvailableResourceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteralAvailableResourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
