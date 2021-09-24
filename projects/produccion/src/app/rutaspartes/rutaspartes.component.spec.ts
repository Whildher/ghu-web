import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaspartesComponent } from './rutaspartes.component';

describe('RutaspartesComponent', () => {
  let component: RutaspartesComponent;
  let fixture: ComponentFixture<RutaspartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaspartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaspartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
