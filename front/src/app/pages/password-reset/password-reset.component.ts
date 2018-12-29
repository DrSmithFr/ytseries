import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ValidationErrors } from '@angular/forms/src/directives/validators';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  initialized: boolean = false;
  tokenValidity: boolean = false;
  passwordUpdated: boolean = false;

  form = this.fb.group({
    password: ['', Validators.required],
    repeated_password: ['', [Validators.required, this.isPasswordRepeated(this)]],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    const token = this.getResetToken();

    if (null === token) {
      this.router.navigate(['/login']);
    }

    this
      .userService
      .isPasswordResetTokenValid(token)
      .subscribe(validity => {
        this.initialized = true;
        this.tokenValidity = validity;
      });
  }

  // carried function to retrieve PasswordRestComponent instance within validator
  isPasswordRepeated(instance: PasswordResetComponent) {
    return (control: AbstractControl): ValidationErrors | null => {
      if ('' === control.value) {
        return {
          passwordEmpty: true
        };
      }

      if (control.value !== instance.form.get('password').value) {
        return {
          passwordDifferent: true
        };
      }

      return null;
    };
  }

  getResetToken(): string | null {
    return this.route.snapshot.queryParams['token'] || null;
  }

  resetPassword() {
    const password = this.form.get('password').value;
    const repeated = this.form.get('repeated_password').value;

    if (password !== repeated) {
      return;
    }

    const token = this.getResetToken();

    if (null === token) {
      return;
    }

    this
      .userService
      .resetPassword(password, token)
      .subscribe(() => {
        this.passwordUpdated = true;
      });
  }

}
