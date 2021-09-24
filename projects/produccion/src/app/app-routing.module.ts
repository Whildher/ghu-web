import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LayoutplantaComponent } from './layoutplanta/layoutplanta.component';
import { MenuregistroComponent } from './menuregistro/menuregistro.component';
import { RutaspartesComponent } from './rutaspartes/rutaspartes.component';
import { PopvisorComponent } from './visor/popvisor/popvisor.component';

const routes: Routes = [
  {path: 'layoutplanta' , component: LayoutplantaComponent},
  {path: 'rutaspartes' , component: RutaspartesComponent},
  {path: 'menuregistro' , component: MenuregistroComponent},
  {path: 'popupvisor' , component: PopvisorComponent},
  {path: '' , component: LayoutplantaComponent}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
