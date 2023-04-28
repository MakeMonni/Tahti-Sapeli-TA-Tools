import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerScore2Component } from './player-score2.component';

describe('PlayerScore2Component', () => {
  let component: PlayerScore2Component;
  let fixture: ComponentFixture<PlayerScore2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerScore2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerScore2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
