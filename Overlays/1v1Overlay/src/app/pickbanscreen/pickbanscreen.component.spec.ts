import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickbanscreenComponent } from './pickbanscreen.component';

describe('PickbanscreenComponent', () => {
  let component: PickbanscreenComponent;
  let fixture: ComponentFixture<PickbanscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickbanscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickbanscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
