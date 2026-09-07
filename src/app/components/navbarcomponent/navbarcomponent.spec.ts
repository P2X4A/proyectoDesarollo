import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { describe, expect, it, vi } from 'vitest';
import { Navbarcomponent } from './navbarcomponent';

describe('Navbarcomponent', () => {
  let component: Navbarcomponent;
  let fixture: ComponentFixture<Navbarcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule],
      providers: [provideRouter([])],
      declarations: [Navbarcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbarcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empieza con búsqueda vacía y carrito en cero', () => {
    expect(component.searchQuery).toBe('');
    expect(component.cartCount).toBe(0);
  });

  it('onSearch navega a /buscar con el término como queryParam', () => {
    const router = TestBed.inject(Router);
    const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.searchQuery = '  iphone  ';
    component.onSearch();

    expect(spy).toHaveBeenCalledWith(['/buscar'], { queryParams: { q: 'iphone' } });
  });

  it('onSearch no navega con búsqueda vacía', () => {
    const router = TestBed.inject(Router);
    const spy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.searchQuery = '   ';
    component.onSearch();

    expect(spy).not.toHaveBeenCalled();
  });
});
