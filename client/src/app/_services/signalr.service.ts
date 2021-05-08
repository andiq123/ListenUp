import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProgressReport } from '../_models/progressReport';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private baseUrl = environment.baseUrlSignalr + 'loading';
  private con!: signalR.HubConnection;
  progress = new Subject<IProgressReport>();
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

    this.con.on('ProgressChanged', (progress: IProgressReport) => {
      this.progress.next(progress);
    });
  }

  disconnectFromSignal() {
    if (this.con.state === 'Connected') {
      this.con.stop();
    }
  }

  AddMyselfToQueue(songId: number) {
    if (this.con.state === 'Connected')
      this.con.invoke('onAddUserToQueue', songId);
  }

  RemoveMyselfFromQueue(songId: number) {
    if (this.con.state === 'Connected')
      this.con.invoke('onRemoveUserFromQueue', songId);
  }
}
