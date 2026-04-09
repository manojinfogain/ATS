import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshDocPuneComponent } from './posh-doc-pune.component';

describe('PoshDocPuneComponent', () => {
  let component: PoshDocPuneComponent;
  let fixture: ComponentFixture<PoshDocPuneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoshDocPuneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoshDocPuneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
