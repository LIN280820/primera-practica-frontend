import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinciasComponent } from './provincias.component';

describe('ProvinciasComponent', () => {
  let component: ProvinciasComponent;
  let fixture: ComponentFixture<ProvinciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvinciasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProvinciasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
