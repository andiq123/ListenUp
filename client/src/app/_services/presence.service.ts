import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private baseUrl = environment.baseUrlSignalr + 'presence';
  private con!: signalR.HubConnection;
  private presenceCount!: number;
  presenceChanged = new Subject<number>();

  constructor() {}

  connectToSignal() {
    this.con = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.None)
      .withUrl(this.baseUrl)
      .build();

    this.con
      .start()
      .then()
      .catch((e) => console.log(e));

    this.con.on('PresenceChange', (usersCount: number) => {
      this.presenceCount = usersCount;
      this.presenceChanged.next(usersCount);
    });
  }

  getUsersCount() {
    return this.presenceCount;
  }
}
