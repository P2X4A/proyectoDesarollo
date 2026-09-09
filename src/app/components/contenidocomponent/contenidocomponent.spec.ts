import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Contenidocomponent } from './contenidocomponent';

describe('Contenidocomponent', () => {
  let component: Contenidocomponent;
  let fixture: ComponentFixture<Contenidocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [provideRouter([]), provideHttpClient()],
      declarations: [Contenidocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Contenidocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empieza en el primer banner', () => {
    expect(component.carouselIndex).toBe(0);
    expect(component.banners.length).toBeGreaterThan(0);
  });
});
