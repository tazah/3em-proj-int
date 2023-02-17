import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingTileComponent } from './drawing-tile.component';

describe('DrawingTileComponent', () => {
  let component: DrawingTileComponent;
  let fixture: ComponentFixture<DrawingTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
