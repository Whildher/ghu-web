import {
	AfterViewChecked,
	AfterViewInit,
	Component,
	OnInit,
	ViewChild,
} from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { Subscription } from 'rxjs';
import { SVisorService } from '../models/s-visor.service';
import { MVisor } from '../models/visor.class';

@Component({
	selector: 'app-popvisor',
	templateUrl: './popvisor.component.html',
	styleUrls: ['./popvisor.component.scss'],
})
export class PopvisorComponent implements OnInit {
	popupVisible = false;
	subscription: Subscription;
	DataVisor: any;
	PrmVisor: MVisor = { Titulo:'', Columnas:[] };
	Titulo = '';
	colOrden: string = '';

	constructor(
		private SVisor: SVisorService
	) {
		this.customizeColumns = this.customizeColumns.bind(this);
		this.onSeleccRuta = this.onSeleccRuta.bind(this);
		this.subscription = this.SVisor.getObsVisor().subscribe((datvisor) => {
			this.popupVisible = datvisor;
			this.DataVisor = this.SVisor.DatosVisor;
			this.PrmVisor = SVisor.PrmVisor;
			this.Titulo = SVisor.PrmVisor.Titulo;
		});
	}

	// Personaliza columnas
	customizeColumns(columns: any): void {
		columns.forEach((col: any) => {
			const TitCol = this.PrmVisor.Columnas.find(
				(x) => x.Nombre === col.dataField
			);
			if (TitCol !== undefined) { col.caption = TitCol.Titulo; }
			else { col.visible = false; }
			col.sortOrder = 'asc';
			this.SVisor.ColSort = { Columna: '', Clase: '' };
		});
	}

	// Seleccion de fila
	onSeleccRuta(e: any): void {
		const component = e.component;
		this.popupVisible = false;
	}

	// Seleccion de fila
	onCellClick(e: any): void {
		const component = e.component;
		if (e.rowType === 'header') {
			this.SVisor.ColSort.Columna = e.column.dataField;
			this.SVisor.ColSort.Clase =
				e.column.sortOrder === 'asc' ? 'desc' : 'asc';
		}
	}

	ngOnInit(): void {
		// this.PrmVisor = this.s_Generales.DatosVisor;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
