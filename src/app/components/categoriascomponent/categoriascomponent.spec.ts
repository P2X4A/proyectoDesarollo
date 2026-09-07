import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { Categoriascomponent } from './categoriascomponent';
import { ProductStoreService } from '../../services/product-store/product-store.service';

@Component({ selector: 'app-ruta-destino', standalone: false, template: '' })
class RutaDestinoStub {}

const CATALOGO = [
  { id: 1, title: 'Laptop', price: 2000000, description: 'D', category: 'electronics', image: 'a.jpg', source: 'api' as const },
  { id: 2, title: 'Camisa', price: 80000, description: 'D', category: "men's clothing", image: 'b.jpg', source: 'api' as const },
];

function configure(nombre: string | null) {
  return TestBed.configureTestingModule({
    imports: [RouterModule],
    providers: [
      provideRouter([
        { path: 'categoria', component: RutaDestinoStub },
        { path: 'categoria/:nombre', component: RutaDestinoStub },
      ]),
      {
        provide: ActivatedRoute,
        useValue: { paramMap: of(convertToParamMap(nombre === null ? {} : { nombre })) },
      },
      {
        provide: ProductStoreService,
        useValue: {
          loadAll: vi.fn(),
          loading: signal(false).asReadonly(),
          error: signal(null).asReadonly(),
          products: signal(CATALOGO).asReadonly(),
          getById: vi.fn(),
        },
      },
    ],
    declarations: [Categoriascomponent, RutaDestinoStub],
  }).compileComponents();
}

describe('Categoriascomponent', () => {
  it('should create en vista grilla (sin :nombre)', async () => {
    await configure(null);
    const fixture = TestBed.createComponent(Categoriascomponent);
    await fixture.whenStable();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.categoriaSeleccionada()).toBeNull();
  });

  it('filtra productos al recibir :nombre', async () => {
    TestBed.resetTestingModule();
    await configure('Tecnología');
    const fixture = TestBed.createComponent(Categoriascomponent);
    await fixture.whenStable();

    expect(fixture.componentInstance.categoriaSeleccionada()).toBe('Tecnología');
    expect(fixture.componentInstance.productos().map((p) => p.id)).toEqual([1]);
  });
});
