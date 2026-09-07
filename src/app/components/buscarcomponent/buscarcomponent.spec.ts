import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { Buscarcomponent } from './buscarcomponent';
import { ProductStoreService } from '../../services/product-store/product-store.service';

@Component({ selector: 'app-ruta-destino', standalone: false, template: '' })
class RutaDestinoStub {}

const CATALOGO = [
  { id: 1, title: 'Audífonos Bluetooth', price: 200000, description: 'Sonido', category: 'electronics', image: 'a.jpg', source: 'api' as const },
  { id: 2, title: 'Camisa', price: 80000, description: 'Algodón', category: "men's clothing", image: 'b.jpg', source: 'api' as const },
];

function configure(q: string | null) {
  return TestBed.configureTestingModule({
    imports: [RouterModule],
    providers: [
      provideRouter([{ path: 'buscar', component: RutaDestinoStub }]),
      {
        provide: ActivatedRoute,
        useValue: { queryParamMap: of(convertToParamMap(q === null ? {} : { q })) },
      },
      {
        provide: ProductStoreService,
        useValue: {
          loadAll: vi.fn(),
          loading: signal(false).asReadonly(),
          error: signal(null).asReadonly(),
          products: signal(CATALOGO).asReadonly(),
          getById: vi.fn((id: number) => CATALOGO.find((p) => p.id === id) ?? null),
        },
      },
    ],
    declarations: [Buscarcomponent, RutaDestinoStub],
  }).compileComponents();
}

describe('Buscarcomponent', () => {
  let component: Buscarcomponent;
  let fixture: ComponentFixture<Buscarcomponent>;

  beforeEach(async () => {
    await configure('audifonos');
    fixture = TestBed.createComponent(Buscarcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lee el término desde ?q= y filtra sin tildes', () => {
    expect(component.query()).toBe('audifonos');
    expect(component.resultados().map((p) => p.id)).toEqual([1]);
  });

  it('agregarAlCarrito ignora ids inexistentes', () => {
    expect(() => component.agregarAlCarrito(999)).not.toThrow();
  });
});
