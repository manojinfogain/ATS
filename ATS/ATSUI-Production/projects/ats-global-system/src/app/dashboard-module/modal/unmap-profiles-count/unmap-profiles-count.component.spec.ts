import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmapProfilesCountComponent } from './unmap-profiles-count.component';

describe('UnmapProfilesCountComponent', () => {
  let component: UnmapProfilesCountComponent;
  let fixture: ComponentFixture<UnmapProfilesCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnmapProfilesCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnmapProfilesCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
