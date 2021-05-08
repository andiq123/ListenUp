import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(
    private authService: AuthService,
    private presenceService: PresenceService
  ) {}
  ngOnInit(): void {
    this.authService.setUserAuthentication();
    this.presenceService.connectToSignal();
  }
}
