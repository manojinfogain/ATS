import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgvConfirmationDownloadComponent } from './bgv-confirmation-download.component';

describe('BgvConfirmationDownloadComponent', () => {
  let component: BgvConfirmationDownloadComponent;
  let fixture: ComponentFixture<BgvConfirmationDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgvConfirmationDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BgvConfirmationDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
