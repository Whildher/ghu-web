import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppsettingsService } from './appsettings.service';
import { AppSettings } from './_class/appsettings.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'produccion';

	constructor(private route: Router) {
  }
  
	ngOnInit(): any {
    // this.route.navigate(['/layoutplanta']);
  }

}
