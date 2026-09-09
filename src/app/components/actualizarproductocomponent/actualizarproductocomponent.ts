import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductStoreService } from '../../services/product-store/product-store.service';

@Component({
  selector: 'app-actualizarproductocomponent',
  standalone: false,
  templateUrl: './actualizarproductocomponent.html',
  styleUrl: './actualizarproductocomponent.css',
})
export class Actualizarproductocomponent {
  private readonly productId: number | null;

  producto = {
    nombre: '',
    precio: null as number | null,
    categoria: '',
    descripcion: '',
    imagen: '',
  };

  isLoading = true;
  isSaving = false;
  errorMsg: string | null = null;

  constructor(
    private store: ProductStoreService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productId = Number.isFinite(id) ? id : null;

    if (this.productId === null) {
      this.errorMsg = 'Publicación no encontrada.';
      this.isLoading = false;
      return;
    }

    this.store.loadAll();

    this.store.loading$.subscribe((cargando) => {
      if (cargando || !this.isLoading || this.productId === null) {
        return;
      }
      const found = this.store.getById(this.productId);
      if (found) {
        this.producto = {
          nombre: found.title,
          precio: found.price,
          categoria: found.category,
          descripcion: found.description,
          imagen: found.image,
        };
      } else {
        this.errorMsg = `No existe una publicación con id ${this.productId}.`;
      }
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  onSubmit() {
    if (this.productId === null || this.isSaving) {
      return;
    }
    this.isSaving = true;
    this.errorMsg = null;

    this.store
      .update(this.productId, {
        title: this.producto.nombre.trim(),
        price: Number(this.producto.precio) || 0,
        description: this.producto.descripcion.trim(),
        category: this.producto.categoria,
        image: this.producto.imagen.trim(),
      })
      .subscribe({
        next: (updated) => {
          if (updated) {
            this.router.navigate(['/listar-producto']);
          } else {
            this.isSaving = false;
            this.errorMsg = 'La publicación ya no existe.';
            this.cdr.markForCheck();
          }
        },
        error: () => {
          this.isSaving = false;
          this.errorMsg = 'No se pudo guardar. Inténtalo de nuevo.';
          this.cdr.markForCheck();
        },
      });
  }
}
