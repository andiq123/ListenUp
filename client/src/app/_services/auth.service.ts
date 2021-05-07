import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl + 'auth';
  private isAuthenticated: boolean = false;
  authenticated = new ReplaySubject<boolean>();

  constructor(private http: HttpClient) {}

  emitUserAuthenticated() {
    this.authenticated.next(this.isAuthenticated);
  }

  setUserAuthentication() {
    const user = localStorage.getItem('user');
    this.isAuthenticated = user ? true : false;
    this.emitUserAuthenticated();
  }

  getUserIfAuthenticated() {
    return this.isAuthenticated;
  }

  login(data: { username: string; password: string }) {
    return this.http.post<{ message: string; userName: string }>(
      this.baseUrl + '/login',
      data
    );
  }

  register(data: {
    username: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.http.post<{ message: string }>(
      this.baseUrl + '/register',
      data
    );
  }

  signOut() {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      this.setUserAuthentication();
    }
  }
}
