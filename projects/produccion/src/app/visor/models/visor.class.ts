import { datosMenuConfig } from '../../_class/menureg.class';

export class MVisor {
	constructor(
		public Titulo: string,
		public Columnas: MColumna[],
		public PrmApl: datosMenuConfig
	) {}
}
export class MColumna {
	constructor(public Nombre: string, public Titulo: string) {}
}
