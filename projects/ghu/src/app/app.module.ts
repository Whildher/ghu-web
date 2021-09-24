import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxButtonModule, DxCheckBoxModule, DxDataGridModule, DxDateBoxModule, DxDropDownBoxModule, 
         DxFormModule, DxListModule, DxLoadPanelModule, DxPopupModule, DxRadioGroupModule, DxScrollViewModule, 
         DxSelectBoxModule, DxTextBoxModule, DxToolbarModule } from 'devextreme-angular';

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
import { DxReportViewerModule } from 'devexpress-reporting-angular';
import { VisorrepComponent } from 'projects/reporting/src/app/visorrep/visorrep.component';
import { PopvisorComponent } from './visor/popvisor/popvisor.component';
import { LiquidacionesComponent } from './liqcontrato/liquidaciones.component';
import { PrmliquidacionComponent } from './prmliquidacion/prmliquidacion.component';
import { LiqgeneradaComponent } from './liqgenerada/liqgenerada.component';


@NgModule({
  declarations: [
    AppComponent,
    LiquidacionesComponent,
    PrincipalComponent,
    VisorrepComponent,
    PopvisorComponent,
    PrmliquidacionComponent,
    LiqgeneradaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    DxReportViewerModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
