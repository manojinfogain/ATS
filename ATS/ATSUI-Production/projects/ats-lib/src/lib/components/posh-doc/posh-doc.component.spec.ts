import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshDocComponent } from './posh-doc.component';

describe('PoshDocComponent', () => {
  let component: PoshDocComponent;
  let fixture: ComponentFixture<PoshDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoshDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoshDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
