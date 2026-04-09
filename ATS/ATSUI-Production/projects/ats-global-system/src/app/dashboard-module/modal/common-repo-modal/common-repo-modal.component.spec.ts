import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonRepoModalComponent } from './common-repo-modal.component';

describe('CommonRepoModalComponent', () => {
  let component: CommonRepoModalComponent;
  let fixture: ComponentFixture<CommonRepoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonRepoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonRepoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
