import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoshDocNntBangloreComponent } from './posh-doc-nnt-banglore.component';

describe('PoshDocNntBangloreComponent', () => {
  let component: PoshDocNntBangloreComponent;
  let fixture: ComponentFixture<PoshDocNntBangloreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoshDocNntBangloreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoshDocNntBangloreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
