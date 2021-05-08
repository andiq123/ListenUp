import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from '../_services/auth.service';
import { SidenavService } from '../_services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  isAuthenticated = false;

  constructor(
    private sideNavService: SidenavService,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.sideNavService.$Show.subscribe(() => this.toggleSidenav());
  }

  ngOnInit(): void {
    this.listenForAuthenticatedChanges();
  }

  listenForAuthenticatedChanges() {
    this.authService.authenticated.subscribe((val) => {
      this.isAuthenticated = val;
    });
  }

  toggleSidenav() {
    this.drawer.toggle();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (this.drawer.opened && window.innerWidth > 800) {
      this.drawer.close();
    }
  }
}
