import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOtherBgvDetailsModalComponent } from './update-other-bgv-details-modal.component';

describe('UpdateOtherBgvDetailsModalComponent', () => {
  let component: UpdateOtherBgvDetailsModalComponent;
  let fixture: ComponentFixture<UpdateOtherBgvDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateOtherBgvDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOtherBgvDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
