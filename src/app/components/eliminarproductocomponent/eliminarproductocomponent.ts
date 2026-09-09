import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductStoreService } from '../../services/product-store/product-store.service';

@Component({
  selector: 'app-eliminarproductocomponent',
  standalone: false,
  templateUrl: './eliminarproductocomponent.html',
  styleUrl: './eliminarproductocomponent.css',
})
export class Eliminarproductocomponent {
  private readonly productId: number | null;

  nombre = '';
  isLoading = true;
  isDeleting = false;
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
        this.nombre = found.title;
      } else {
        this.errorMsg = `No existe una publicación con id ${this.productId}.`;
      }
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  onConfirmDelete() {
    if (this.productId === null || this.isDeleting) {
      return;
    }
    this.isDeleting = true;
    this.errorMsg = null;

    this.store.remove(this.productId).subscribe({
      next: (deleted) => {
        if (deleted) {
          this.router.navigate(['/listar-producto']);
        } else {
          this.isDeleting = false;
          this.errorMsg = 'La publicación ya no existe.';
          this.cdr.markForCheck();
        }
      },
      error: () => {
        this.isDeleting = false;
        this.errorMsg = 'No se pudo eliminar. Inténtalo de nuevo.';
        this.cdr.markForCheck();
      },
    });
  }
}
