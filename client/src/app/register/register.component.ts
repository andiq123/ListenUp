import { ArrayType } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    const { username, password, confirmPassword } = form.value;
    this.authService
      .register({ username, password, confirmPassword })
      .subscribe(
        (data) => {
          this.snackBar.open('User Registered Successfully', 'close', {
            duration: 5000,
          });
          this.router.navigate(['/login']);
        },
        (e) => {
          const validation = e.error.errors;
          if (validation) {
            if (typeof validation === typeof []) {
              validation.forEach((error: string) => {
                this.snackBar.open(error, 'close', {
                  duration: 5000,
                });
              });
            } else {
              for (const key in validation) {
                validation[key].forEach((error: string) => {
                  this.snackBar.open(error, 'close', {
                    duration: 5000,
                  });
                });
              }
            }
          } else if (e.error.message) {
            this.snackBar.open(e.error.message, 'close', { duration: 5000 });
          }
        }
      );
  }
}
