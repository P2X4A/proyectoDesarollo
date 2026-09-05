import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eliminarproductocomponent',
  standalone: false,
  templateUrl: './eliminarproductocomponent.html',
  styleUrl: './eliminarproductocomponent.css',
})
export class Eliminarproductocomponent {
  producto = {
    id: 1,
    nombre: 'Audífonos Bluetooth JBL Tune 710BT'
  };

  constructor(private router: Router) {}

  onConfirmDelete() {
    console.log('Eliminando producto con ID:', this.producto.id);
    alert('Producto eliminado exitosamente (Simulación)');
    this.router.navigate(['/listar-producto']);
  }
}
