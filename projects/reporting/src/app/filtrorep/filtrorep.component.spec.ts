import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrorepComponent } from './filtrorep.component';

describe('FiltrorepComponent', () => {
  let component: FiltrorepComponent;
  let fixture: ComponentFixture<FiltrorepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltrorepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrorepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
