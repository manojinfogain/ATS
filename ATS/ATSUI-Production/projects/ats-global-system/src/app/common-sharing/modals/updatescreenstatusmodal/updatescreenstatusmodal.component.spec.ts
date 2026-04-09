import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatescreenstatusmodalComponent } from './updatescreenstatusmodal.component';

describe('UpdatescreenstatusmodalComponent', () => {
  let component: UpdatescreenstatusmodalComponent;
  let fixture: ComponentFixture<UpdatescreenstatusmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatescreenstatusmodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatescreenstatusmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
