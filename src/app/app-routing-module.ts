import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Contenidocomponent } from './components/contenidocomponent/contenidocomponent';
import { Crearproductocomponent } from './components/crearproductocomponent/crearproductocomponent';
import { Listarproductocomponent } from './components/listarproductocomponent/listarproductocomponent';
import { Actualizarproductocomponent } from './components/actualizarproductocomponent/actualizarproductocomponent';
import { Eliminarproductocomponent } from './components/eliminarproductocomponent/eliminarproductocomponent';
import { Categoriascomponent } from './components/categoriascomponent/categoriascomponent';
import { Mercadoplaycomponent } from './components/mercadoplaycomponent/mercadoplaycomponent';

import { Carritocomponent } from './components/carritocomponent/carritocomponent';


const routes: Routes = [
  { path: '', component: Contenidocomponent },
  { path: 'crear-producto', component: Crearproductocomponent },
  { path: 'listar-producto', component: Listarproductocomponent },
  { path: 'actualizar-producto', component: Actualizarproductocomponent },
  { path: 'eliminar-producto', component: Eliminarproductocomponent },
  { path: 'categoria', component: Categoriascomponent },
  { path: 'mercado-play', component: Mercadoplaycomponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },

  { path: 'carrito', component: Carritocomponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
