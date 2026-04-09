import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrcInfoDetailsComponent } from './crc-info-details.component';

describe('CrcInfoDetailsComponent', () => {
  let component: CrcInfoDetailsComponent;
  let fixture: ComponentFixture<CrcInfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrcInfoDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrcInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
