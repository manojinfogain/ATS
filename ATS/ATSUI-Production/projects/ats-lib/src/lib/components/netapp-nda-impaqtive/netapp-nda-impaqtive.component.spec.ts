import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetappNdaImpaqtiveComponent } from './netapp-nda-impaqtive.component';

describe('NetappNdaImpaqtiveComponent', () => {
  let component: NetappNdaImpaqtiveComponent;
  let fixture: ComponentFixture<NetappNdaImpaqtiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetappNdaImpaqtiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetappNdaImpaqtiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
