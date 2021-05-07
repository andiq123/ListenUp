import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  errors: string[] = [];
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    const { username, password, confirmPassword } = form.value;
    this.authService
      .register({ username, password, confirmPassword })
      .subscribe(
        (data) => {
          this.router.navigate(['/login']);
        },
        (e) => {
          this.errors = [];
          if (e.error.message) {
            this.errors.push(e.error.message);
          }
          if (e.error.errors) {
            e.error.errors.forEach((error: any) => {
              this.errors.push(error);
            });
          }
        }
      );
  }
}
