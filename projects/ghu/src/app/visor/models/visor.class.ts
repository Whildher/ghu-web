
export class MVisor {
	constructor(
		public Titulo: string,
		public Columnas: MColumna[]
	) {}
}
export class MColumna {
	constructor(public Nombre: string, public Titulo: string) {}
}
