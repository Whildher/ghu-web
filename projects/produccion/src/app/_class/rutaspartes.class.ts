export class MRutasPartes {
	constructor(
		public ID_RUTA: string,
		public DESCRIPCION: string,
		public ESTADO: string,
		public TIPO: string,
		public PRIORIDAD: string,
		public SECCIONES: string,
		public LAYOUT_DP: string,
		public DIAGRAMA: string
	) {}
}

export class MSeccionesPartes {
	constructor(
		public ID_SECCION: string,
		public ITEM: number,
		public DESCRIPCION: string,
		public ANTERIOR: number,
		public ID_UN?: string,
		public ID_UN_ITEM?: string,
		public ASIGNABLE?: boolean,
		public ESTADO?: string,
		public INVENTARIO?: boolean,
		public TIPO?: string,
		public MANO_OBRA?: boolean,
		public MSG?: string,
		public RUTA_PARTE?: boolean,
		public PRECEDENTES?: string
	) {}
}
