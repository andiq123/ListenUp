import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private ShowEventSource = new ReplaySubject();
  public $Show = this.ShowEventSource.asObservable();

  constructor() {}

  public toggleSideNav() {
    this.ShowEventSource.next();
  }
}
