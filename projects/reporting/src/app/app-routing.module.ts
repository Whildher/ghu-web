import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignerComponent } from './designer/designer.component';
import { FiltrorepComponent } from './filtrorep/filtrorep.component';
import { RepaplicacionComponent } from './repaplicacion/repaplicacion.component';
import { ReportesComponent } from './reportes/reportes.component';
import { VisorrepComponent } from './visorrep/visorrep.component';

const routes: Routes = [
  {path: 'reportes' , component: ReportesComponent},
  {path: 'repaplicacion' , component: RepaplicacionComponent, outlet: 'admreportes'},
  {path: 'filtrorep' , component: FiltrorepComponent, outlet: 'admreportes'},
  {path: 'designer' , component: DesignerComponent},
  {path: 'visorrep' , component: VisorrepComponent},
  {path: '**' , component: ReportesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
