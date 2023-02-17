import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumCenterComponent } from './album-center.component';

describe('AlbumCenterComponent', () => {
  let component: AlbumCenterComponent;
  let fixture: ComponentFixture<AlbumCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
