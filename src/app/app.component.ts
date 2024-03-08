import { Component } from '@angular/core';

import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [ SidebarComponent ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
