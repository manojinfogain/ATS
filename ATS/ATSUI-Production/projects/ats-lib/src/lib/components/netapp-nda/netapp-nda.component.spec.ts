import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetappNdaComponent } from './netapp-nda.component';

describe('NetappNdaComponent', () => {
  let component: NetappNdaComponent;
  let fixture: ComponentFixture<NetappNdaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetappNdaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetappNdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
