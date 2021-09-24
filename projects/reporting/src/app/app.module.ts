import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxReportDesignerModule, DxReportViewerModule } from 'devexpress-reporting-angular';
import { DxButtonModule, DxDataGridModule, DxDrawerModule, DxListModule, DxRadioGroupModule, DxScrollViewModule, DxToolbarModule } from 'devextreme-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SplitterModule } from 'primeng/splitter';
import { ReportesComponent } from './reportes/reportes.component';
import { RepaplicacionComponent } from './repaplicacion/repaplicacion.component';
import { FiltrorepComponent } from './filtrorep/filtrorep.component';
import { VisorrepComponent } from './visorrep/visorrep.component';
import { NavappComponent } from './navapp/navapp.component';
import { DesignerComponent } from './designer/designer.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    DesignerComponent,
    AppComponent,
    ReportesComponent,
    RepaplicacionComponent,
    FiltrorepComponent,
    VisorrepComponent,  
    NavappComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    DxReportDesignerModule,
    DxReportViewerModule,
    HttpClientModule,
    DxDrawerModule,
    DxListModule,
    DxRadioGroupModule,
    DxToolbarModule,
    DxButtonModule,
    DxScrollViewModule,
    DxDataGridModule,
    BreadcrumbModule,
    SplitterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
