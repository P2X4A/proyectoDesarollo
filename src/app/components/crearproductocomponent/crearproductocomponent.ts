import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crearproductocomponent',
  standalone: false,
  templateUrl: './crearproductocomponent.html',
  styleUrl: './crearproductocomponent.css',
})
export class Crearproductocomponent {
  producto = {
    nombre: '',
    precio: null,
    categoria: '',
    descripcion: '',
    imagen: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Producto a crear:', this.producto);
    // TODO: Guardar en DataService / JSON
    alert('Producto creado exitosamente (Simulación)');
    this.router.navigate(['/listar-producto']);
  }
}
