import { Injectable } from '@angular/core';

export class clsDatosLiq {
  public id_apl : string;
  public id_liq : string;
  public nom_liq : string;
  public id_rep : string;
  public filtro : string;
  public num_liq : string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  public clid: string;
  public usuario: string;
  public nom_usr: string;
  public dat_liq: clsDatosLiq;
  public tit_pag: string;

  constructor() { }

}
