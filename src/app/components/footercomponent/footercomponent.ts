import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footercomponent',
  standalone: false,
  styleUrl: './footercomponent.css',
  templateUrl: './footercomponent.html',
})
export class Footercomponent implements OnInit {
  /** Año actual para el copyright dinámico */
  currentYear: number = new Date().getFullYear();

  ngOnInit(): void {
    // El año se asigna automáticamente al instanciar el componente
  }
}
