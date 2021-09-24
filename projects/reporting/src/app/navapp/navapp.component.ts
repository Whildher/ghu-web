import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navapp',
  templateUrl: './navapp.component.html',
  styleUrls: ['./navapp.component.css']
})
export class NavappComponent implements OnInit {
  readonly home = {icon: 'pi pi-home', name: 'home'};
  itemsNav: MenuItem[] = [];
  IdAplicacion: string = 'PRO-013';
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
