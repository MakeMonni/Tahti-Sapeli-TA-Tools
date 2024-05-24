import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickbanmapComponent } from './pickbanmap.component';

describe('PickbanmapComponent', () => {
  let component: PickbanmapComponent;
  let fixture: ComponentFixture<PickbanmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickbanmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickbanmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
