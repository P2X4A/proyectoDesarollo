import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actualizarproductocomponent',
  standalone: false,
  templateUrl: './actualizarproductocomponent.html',
  styleUrl: './actualizarproductocomponent.css',
})
export class Actualizarproductocomponent {
  producto = {
    id: 1,
    nombre: 'Audífonos Bluetooth JBL Tune 710BT',
    precio: 189000,
    categoria: 'Tecnología',
    descripcion: 'Excelentes audífonos con batería de larga duración.',
    imagen: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Producto a actualizar:', this.producto);
    alert('Producto actualizado exitosamente (Simulación)');
    this.router.navigate(['/listar-producto']);
  }
}
