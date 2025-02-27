import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet,
    NavbarComponent,
    NgIf
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavbar: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.showNavbar = this.router.url !== '/login';
    });
  }
}
