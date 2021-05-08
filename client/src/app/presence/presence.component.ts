import { Component, OnInit } from '@angular/core';
import { PresenceService } from '../_services/presence.service';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss'],
})
export class PresenceComponent implements OnInit {
  usersCount: number = 0;
  constructor(private presenceService: PresenceService) {}

  ngOnInit(): void {
    this.usersCount = this.presenceService.getUsersCount();
    this.presenceService.presenceChanged.subscribe((usersCount: number) => {
      this.usersCount = usersCount;
    });
  }
}
