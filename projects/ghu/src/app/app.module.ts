import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxDrawerModule, DxDropDownBoxModule, 
         DxFormModule, DxListModule, DxLoadIndicatorModule, DxLoadPanelModule, DxNumberBoxModule, DxPopupModule, DxRadioGroupModule, DxScrollViewModule, 
         DxSelectBoxModule, DxTextBoxModule, DxTileViewModule, DxToastModule, DxToolbarModule, DxTooltipModule } from 'devextreme-angular';

import { AppComponent } from './app.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AppRoutingModule } from './app-routing.module';

import { SplitterModule } from 'primeng/splitter';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';

import { PrincipalComponent } from './principal/principal.component';
import { DatePipe } from '@angular/common';
import { DxReportDesignerModule, DxReportViewerModule } from 'devexpress-reporting-angular';
import { PopvisorComponent } from './visor/popvisor/popvisor.component';
import { LiquidacionesComponent } from './liqcontrato/liquidaciones.component';
import { PrmliquidacionComponent } from './prmliquidacion/prmliquidacion.component';
import { LiqgeneradaComponent } from './liqgenerada/liqgenerada.component';
import { VisorrepComponent } from 'projects/reporting/src/app/visorrep/visorrep.component';
import { GlobalsService } from './globals.service';
import { AppsettingsService } from './appsettings.service';
import { NomelecComponent } from './nomelec/nomelec.component';
import { ReportesComponent } from 'projects/reporting/src/app/reportes/reportes.component';
import { FormsModule } from '@angular/forms';
import { RepaplicacionComponent } from 'projects/reporting/src/app/repaplicacion/repaplicacion.component';
import { FiltrorepComponent } from 'projects/reporting/src/app/filtrorep/filtrorep.component';
import { NominaComponent } from './nomina/nomina.component';
import { LiqmensualComponent } from './liqmensual/liqmensual.component';
import { LiqdetalleComponent } from './liqdetalle/liqdetalle.component';


@NgModule({
  declarations: [
    AppComponent,
    LiquidacionesComponent,
    PrincipalComponent,
    VisorrepComponent,
    PopvisorComponent,
    PrmliquidacionComponent,
    LiqgeneradaComponent,
    NomelecComponent,
    ReportesComponent,
    RepaplicacionComponent,
    FiltrorepComponent,
    NominaComponent,
    LiqmensualComponent,
    LiqdetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DxDataGridModule,
    DxLoadPanelModule,    
    DxFormModule,
    DxDropDownBoxModule,
    DxButtonModule,
    DxLoadPanelModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    BreadcrumbModule,
    SplitterModule,
    DxSelectBoxModule,
    DxPopupModule,
    DxDateBoxModule,
    CardModule,
    ButtonModule,
    ToolbarModule,
    SplitButtonModule,
    BrowserAnimationsModule,
    DataViewModule,
    DialogModule,
    DxDrawerModule,
    DxListModule,
    DxRadioGroupModule,
    DxToolbarModule,
    DxScrollViewModule,
    DxReportDesignerModule,
    DxReportViewerModule,
    DxLoadIndicatorModule,
    DxTooltipModule,
    DxToastModule,
    DxNumberBoxModule,
    DxTileViewModule
  ],
  providers: [DatePipe, GlobalsService, AppsettingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
