import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { SidenavService } from '../_services/sidenav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isAuthenticated = false;
  constructor(
    private sideNavService: SidenavService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.listenForAuthenticationChanges();
  }
  listenForAuthenticationChanges() {
    this.authService.authenticated.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
    });
  }

  toggleDrawer() {
    this.sideNavService.toggleSideNav();
  }
}
