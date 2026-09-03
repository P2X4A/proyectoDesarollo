import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contenidocomponent } from './contenidocomponent';

describe('Contenidocomponent', () => {
  let component: Contenidocomponent;
  let fixture: ComponentFixture<Contenidocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Contenidocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Contenidocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
