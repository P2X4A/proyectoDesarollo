import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContenidocomponentComponent } from './components/contenidocomponent/contenidocomponent';
import { CrearproductocomponentComponent } from './components/crearproductocomponent/crearproductocomponent';
import { ListarproductocomponentComponent } from './components/listarproductocomponent/listarproductocomponent';
import { ActualizarproductocomponentComponent } from './components/actualizarproductocomponent/actualizarproductocomponent';
import { EliminarproductocomponentComponent } from './components/eliminarproductocomponent/eliminarproductocomponent';
import { CategoriascomponentComponent } from './components/categoriascomponent/categoriascomponent';
import { MercadoplaycomponentComponent } from './components/mercadoplaycomponent/mercadoplaycomponent';

const routes: Routes = [
  { path: '', component: ContenidocomponentComponent },
  { path: 'crear-producto', component: CrearproductocomponentComponent },
  { path: 'listar-producto', component: ListarproductocomponentComponent },
  { path: 'actualizar-producto', component: ActualizarproductocomponentComponent },
  { path: 'eliminar-producto', component: EliminarproductocomponentComponent },
  { path: 'categoria', component: CategoriascomponentComponent },
  { path: 'mercado-play', component: MercadoplaycomponentComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
