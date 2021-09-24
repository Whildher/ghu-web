import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisorrepComponent } from 'projects/reporting/src/app/visorrep/visorrep.component';
import { LiquidacionesComponent } from './liqcontrato/liquidaciones.component';
import { LiqgeneradaComponent } from './liqgenerada/liqgenerada.component';
import { PrincipalComponent } from './principal/principal.component';
import { PrmliquidacionComponent } from './prmliquidacion/prmliquidacion.component';

const routes: Routes = [
  {path: 'principal' , component: PrincipalComponent},
  {path: 'prmliquidacion' , component: PrmliquidacionComponent},
  {path: 'liqgenerada' , component: LiqgeneradaComponent},
  {path: 'liquidaciones' , component: LiquidacionesComponent},
  {path: 'visorrep' , component: VisorrepComponent},
  {path: '**' , component: PrincipalComponent}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
