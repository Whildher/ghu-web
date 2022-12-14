import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiltrorepComponent } from 'projects/reporting/src/app/filtrorep/filtrorep.component';
import { RepaplicacionComponent } from 'projects/reporting/src/app/repaplicacion/repaplicacion.component';
import { ReportesComponent } from 'projects/reporting/src/app/reportes/reportes.component';
import { GlobalsService } from './globals.service';
import { LiquidacionesComponent } from './liqcontrato/liquidaciones.component';
import { LiqgeneradaComponent } from './liqgenerada/liqgenerada.component';
import { LiqmensualComponent } from './liqmensual/liqmensual.component';
import { ListadocelecComponent } from './listadocelec/listadocelec.component';
import { NomelecComponent } from './nomelec/nomelec.component';
import { NominaComponent } from './nomina/nomina.component';
import { PgridComponent } from './pgrid/pgrid.component';
import { PrincipalComponent } from './principal/principal.component';
import { PrmliquidacionComponent } from './prmliquidacion/prmliquidacion.component';
import { VisorrepComponent } from './visorrep/visorrep.component';

const routes: Routes = [
  {path: 'principal' , component: PrincipalComponent},
  {path: 'prmliquidacion' , component: PrmliquidacionComponent},
  {path: 'liqgenerada' , component: LiqgeneradaComponent},
  {path: 'liquidaciones' , component: LiquidacionesComponent},
  {path: 'liqmensual' , component: LiqmensualComponent},
  {path: 'nomina' , component: NominaComponent},
  {path: 'nomelec' , component: NomelecComponent},
  {path: 'listadocelec' , component: ListadocelecComponent},
  {path: 'visorrep' , component: VisorrepComponent},
  {path: 'reportes' , component: ReportesComponent},
  {path: 'filtrorep' , component: FiltrorepComponent},
  {path: 'repaplicacion' , component: RepaplicacionComponent},
  {path: 'pgrid' , component: PgridComponent},
  {path: '**' , component: PrincipalComponent}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
