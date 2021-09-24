import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxButtonModule, DxCheckBoxModule, DxContextMenuModule, DxDataGridModule, DxDiagramComponent, DxDiagramModule, DxDropDownBoxModule, 
         DxFormModule, DxMenuModule, DxPopupModule, DxScrollViewModule, 
         DxSelectBoxModule, DxTextBoxModule, DxToolbarModule, DxTreeListModule, DxTreeViewModule, 
         DxValidationGroupModule, DxValidatorModule } from 'devextreme-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutplantaComponent } from './layoutplanta/layoutplanta.component';
import { AngularSplitModule } from 'angular-split';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuregistroComponent } from './menuregistro/menuregistro.component';
import { FormsModule } from '@angular/forms';
import { PopvisorComponent } from './visor/popvisor/popvisor.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { RutaspartesComponent } from './rutaspartes/rutaspartes.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutplantaComponent,
    RutaspartesComponent,
    MenuregistroComponent,
    PopvisorComponent,
    RutaspartesComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    DxTreeListModule,
		DxDropDownBoxModule,
		DxDiagramModule,
		DxScrollViewModule,
    DxFormModule,
    DxToolbarModule,
		DxButtonModule,
		DxCheckBoxModule,
		DxTextBoxModule,
		DxValidatorModule,
		DxValidationGroupModule,
		DxSelectBoxModule,
    DxPopupModule,
    DxContextMenuModule,
		DxMenuModule,
    DxDataGridModule,
    AngularSplitModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    MessagesModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
