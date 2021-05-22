import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BarbarusComponent} from './barbarus.component';

describe('LoginComponent', () => {
  let component: BarbarusComponent;
  let fixture: ComponentFixture<BarbarusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BarbarusComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarbarusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
