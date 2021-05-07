import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    const { username, password } = form.value;
    this.authService.login({ username, password }).subscribe(
      (data) => {
        localStorage.setItem(
          'user',
          JSON.stringify({ token: data.message, username: data.userName })
        );
        this.authService.setUserAuthentication();
        this.router.navigate(['/home']);
      },
      (e) => {
        const validation = e.error.errors;
        if (validation) {
          for (const key in validation) {
            validation[key].forEach((error: string) => {
              this.snackBar.open(error, 'close', {
                duration: 5000,
              });
            });
          }
        } else if (e.error.message) {
          this.snackBar.open(e.error.message, 'close', { duration: 5000 });
        }
      }
    );
  }
}
