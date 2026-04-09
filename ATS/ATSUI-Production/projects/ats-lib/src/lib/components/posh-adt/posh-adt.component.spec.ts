import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshADTComponent } from './posh-adt.component';

describe('PoshADTComponent', () => {
  let component: PoshADTComponent;
  let fixture: ComponentFixture<PoshADTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoshADTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoshADTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
